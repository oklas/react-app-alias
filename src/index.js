const fs = require('fs')
const path = require('path')
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin')
const paths = require('react-scripts/config/paths')

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
    plugins.splice(pluginPos, 1)
    plugins[pluginPos] = new ModuleScopePlugin(dirs, files)
  }
}

function alias(aliasMap) {
  const aliasLocal = Object.keys(aliasMap).reduce( (a,i) => {
    a[i] = path.resolve(paths.appPath, aliasMap[i])
    return a
  }, {})
  return function(config) {
    expandResolveAlias(config.resolve, aliasLocal)
    expandRulesInclude(config.module.rules, Object.values(aliasLocal))
    expandPluginsScope(config.resolve.plugins, Object.values(aliasLocal), Object.values(aliasLocal))
    return config
  }
}

function configPaths(configPath = '') {
  const confPath = (
    configPath.length > 0 && fs.existsSync(path.resolve(paths.appPath, configPath)) ?
      path.resolve(paths.appPath, configPath) :
    fs.existsSync(path.resolve(paths.appPath, 'tsconfig.json')) ?
      path.resolve(paths.appPath, 'tsconfig.json') :
    fs.existsSync(path.resolve(paths.appPath, 'jsconfig.json')) ?
      path.resolve(paths.appPath, 'jsconfig.json') :
    ''
  )

  if(!confPath)
    throw Error('react-app-rewire-alias:configPaths: there is no config file found')

  const conf = require(confPath)
  const extmsg = !conf.extends ? '' : `, specify ${conf.extends} instead of ${confPath} for configPaths()`
    

  if(typeof conf.compilerOptions.paths !== 'object' )
    throw Error(`
      react-app-rewire-alias:configPaths: array expected for paths${extmsg}`)

  if(!conf.compilerOptions || !conf.compilerOptions.paths)
    return {}

  return Object.keys(conf.compilerOptions.paths).reduce( (a, path) => {
    const value = conf.compilerOptions.paths[path]
    const target = Array.isArray(value) ? value[0] : value
    a[path.replace(/\/\*$/,'')] = target.replace(/\/\*$/,'')
    return a
  }, {})
}

const CracoAliasPlugin = {
  overrideWebpackConfig: function({webpackConfig, pluginOptions}) {
    return alias(pluginOptions.alias||configPaths())(webpackConfig)
  },
}

module.exports = {
  alias,
  configPaths,
  expandResolveAlias,
  expandRulesInclude,
  expandPluginsScope,
  CracoAliasPlugin,
}