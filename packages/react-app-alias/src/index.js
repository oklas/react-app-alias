const fs = require('fs')
const path = require('path')
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin')
const paths = require('react-scripts/config/paths')

const guessConfigFiles = [
  'tsconfig.json',
  'tsconfig.paths.json',
  'jsconfig.json',
  'jsconfig.paths.json',
]

function expandResolveAlias(resolve, alias) {
  resolve.alias = Object.assign(resolve.alias || {}, alias)
}

function expandRulesInclude(rules, include) {
  rules.forEach(function(rule) {
    if(rule.include === paths.appSrc)
      rule.include = include.concat(rule.include)
    if(rule.oneOf)
      expandRulesInclude(rule.oneOf, include)
  })
}

function expandPluginsScope(plugins, dirs, files) {
  dirs = [
    paths.appSrc,
    ...dirs.filter(
      dir => !fs.existsSync(dir) || fs.lstatSync(dir).isDirectory()
    )
  ]
  files = [
    paths.appPackageJson,
    ...dirs.filter(dir => fs.existsSync(dir) && fs.lstatSync(dir).isFile()),
    ...(files || []),
  ]
  const pluginName = 'ModuleScopePlugin'
  const pluginPos = plugins
    .map(x => x.constructor.name)
    .indexOf(pluginName)
  if(pluginPos !== -1) {
    const oldModuleScopePlugin = plugins[pluginPos]
    const allowedFiles = [...oldModuleScopePlugin.allowedFiles].filter(f => f !== paths.appPackageJson)
    files.push(...allowedFiles)
    plugins[pluginPos] = new ModuleScopePlugin(dirs, files)
  }
}

function isOutsideOfRoot(targ) {
  const rel = path.relative(paths.appPath, targ)
  return rel.startsWith('..') || path.isAbsolute(rel)
}

function checkOutside(aliasMap) {
  const outside = Object.keys(aliasMap).reduce( (a, i) => {
    if(isOutsideOfRoot(aliasMap[i])) {
      console.error(
        `alias '${i}' is outside of root - supported only by react-app-alias-ex`
      )
      return true
    }
    return a
  }, false)
  if(outside) {
    console.error(
      `https://github.com/oklas/react-app-alias#outside-of-root`
    )
    process.exit(-1)
  }
}

function aliasWebpack(options) {
  const {aliasMap, baseUrl} = defaultOptions(options)
  checkOutside(aliasMap)
  const aliasLocal = Object.keys(aliasMap).reduce( (a,i) => {
    a[i] = path.resolve(paths.appPath, baseUrl, aliasMap[i])
    return a
  }, {})
  return function(config) {
    expandResolveAlias(config.resolve, aliasLocal)
    expandRulesInclude(config.module.rules, Object.values(aliasLocal))
    expandPluginsScope(config.resolve.plugins, Object.values(aliasLocal), Object.values(aliasLocal))
    return config
  }
}

function aliasJest(options) {
  const {baseUrl, aliasMap} = defaultOptions(options)
  const jestAliasMap = aliasMapForJest(baseUrl, aliasMap)
  return function(config) {
    return {
      ...config,
      moduleNameMapper: {
        ...config.moduleNameMapper,
        ...jestAliasMap,
      }
    }
  }
}

function autoscan(tasks) {
  const dirlist = dir =>
    fs.readdirSync(dir).filter(
       file => fs.statSync(path.resolve(dir, file)).isDirectory())
  if(!Array.isArray(tasks)) tasks = tasks ? [tasks] : []
  tasks = tasks.map(task => (task===task+'') ? {path: task} : task)
  tasks = tasks.map(task => ({
    prefix: '',
    suffix: '',
    ...task,
  }))
  const aliasMap = tasks.map(task => (
    dirlist(task.path).reduce(
      (a, alias) => ({
        ...a,
        [task.prefix + alias + task.suffix]:
          path.join(task.path, alias)
      }),
      {}
    )
  )).reduce((a, map) => ({...a, ...map}), {})
  return aliasMap
}

function configFilePathSafe(configPath = '') {
  if(
    configPath.length > 0 && fs.existsSync(path.resolve(paths.appPath, configPath))
  ) return path.resolve(paths.appPath, configPath)
  const existsPaths = (guessConfigFiles
    .map(filename => path.resolve(paths.appPath, filename))
    .filter(pathname => fs.existsSync(pathname))
  )
  return existsPaths.length ? existsPaths[0] : ''
}

function readConfig(confPath) {
  if(!confPath)
    throw Error('react-app-alias:readConfig: there is no [ts|js]config file found')

  const confdir = path.dirname(confPath)
  const conf = {...require(confPath)}

  const extUrl = conf.extends
  const extPath = extUrl ? path.resolve(confdir, extUrl) : ''
  conf.extends = extUrl ? require(extPath) : {}

  return conf
}

function configPathsRaw(conf) {
  const confPaths = conf.compilerOptions && conf.compilerOptions.paths ?
    conf.compilerOptions.paths : {}

  const ext = conf.extends || {}
  const extPaths = ext.compilerOptions && ext.compilerOptions.paths ?
    ext.compilerOptions.paths : {}

  if(typeof confPaths !== 'object')
    throw Error(`react-app-alias:configPathsRaw: compilerOptions.paths must be object`)
  if(typeof extPaths !== 'object')
    throw Error(`react-app-alias:configPathsRaw: compilerOptions.extends->compilerOptions.paths must be object`)

  return {
    ...confPaths,
    ...extPaths,
  }
}

function configPaths(configPath = '', confUndoc) {
  const confPath = configFilePathSafe(configPath)
  const conf = confUndoc || readConfig(confPath) 
  const paths = configPathsRaw(conf)
  const aliasMap = Object.keys(paths).reduce( (a, path) => {
    const value = paths[path]
    const target = Array.isArray(value) ? value[0] : value
    a[path.replace(/\/\*$/,'')] = target.replace(/\/\*$/,'')
    return a
  }, {})
  return aliasMap
}

function defaultOptions(options = {}) {
  const configPath = configFilePathSafe(
    options.tsconfig || options.jsconfig
  )
  const conf = readConfig(configPath)
  
  const aliasMap = options.alias || configPaths(configPath, conf)
  const aliasAutoMap = autoscan(options.autoscan)

  if(options.autoscan)
    console.warn('react-app-alias: You are using experimental `autoscan` feature (https://github.com/oklas/react-app-alias/issues/70) it is not documented and may be it will be removed')

  const opts = {
    baseUrl: conf.compilerOptions.baseUrl || '.',
    ...options,
    aliasMap: {
      ...aliasAutoMap,
      ...aliasMap,
    },
  }
  return opts
}

function aliasMapForJest(baseUrl, aliasMap) {
  return Object.keys(aliasMap).reduce( (a, i) => {
    const outside = isOutsideOfRoot(aliasMap[i])
    const restr = i.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const alias = `^${restr}/(.*)$`
    const targ = outside ? path.resolve(baseUrl, aliasMap[i])+'/$1' : `<rootDir>/${aliasMap[i]}/$1`
    return { ...a, [alias]: targ }
  }, {})
}

const CracoAliasPlugin = {
  overrideWebpackConfig: function({webpackConfig, pluginOptions}) {
    return aliasWebpack(pluginOptions)(webpackConfig)
  },
  overrideJestConfig: function({jestConfig, pluginOptions}) {
    return aliasJest(pluginOptions)(jestConfig)
  }
}

module.exports = {
  aliasWebpack,
  aliasJest,
  autoscan,
  configFilePathSafe,
  readConfig,
  configPathsRaw,
  configPaths,
  defaultOptions,
  expandResolveAlias,
  expandRulesInclude,
  expandPluginsScope,
  CracoAliasPlugin,
}
