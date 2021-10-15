const path = require('path')
const paths = require('react-scripts/config/paths')
const {
  aliasJest: aliasJestSafe,
  configFilePath,
  configPathsRaw,
  configPaths,
  expandResolveAlias,
  expandPluginsScope,
} = require('./index')

function requireEslintLoaderModule() {
  try {
    return require.resolve('eslint-loader')
  } catch(e) {}
  return undefined
}

const eslintLoaderModule = requireEslintLoaderModule()

function isRuleOfEslint(rule) {
  if(eslintLoaderModule && eslintLoaderModule === rule.loader) return true
  return rule.use && 0 < rule.use.filter(isRuleOfEslint).length
}

function isLocalPath(parent) {
  return function(dir) {
    const relative = path.relative(parent, dir)
    return relative && !relative.startsWith('..') && !path.isAbsolute(relative)
  }
}

function updateInclude(rule, include) {
  rule.include = (
    isRuleOfEslint(rule) ? include.filter(isLocalPath(paths.appSrc)) : include
  ).concat(rule.include)
}

function expandRulesInclude(rules, include) {
  rules.forEach(function(rule) {
    if(rule.include === paths.appSrc) {
      updateInclude(rule, include)
    }
    if(rule.oneOf)
      expandRulesInclude(rule.oneOf, include)
  })
}

function packageList() {
  const packagePath = path.resolve(paths.appPath, 'package.json') 
  const package = require(packagePath)
  const depsSections = [
    ...Object.keys(package).filter(s => s.match(/.*Dependencies/)),
    'dependencies',
  ]
  const list = [].concat(...depsSections.map(s => Object.keys(package[s])))
  return list
}

function packagePathsRaw() {
  const packages = packageList();
  const pathList = packages.reduce((a,i) => (
    {
      ...a,
      [i]: [
        path.resolve(paths.appPath, 'node_modules', i),
        path.resolve(paths.appPath, 'node_modules', '@types', i),
      ],
      [`${i}/*`]: [
        path.resolve(paths.appPath, 'node_modules', i) + '/*',
        path.resolve(paths.appPath, 'node_modules', '@types', i) + "/*",
      ],
    }
  ), {})
  return pathList
}

function expandPluginsTsChecker(plugins, configPath) {
  const pluginName = 'ForkTsCheckerWebpackPlugin'
  const confPath = configFilePath(configPath)
  const tsjsPaths = configPathsRaw(confPath)
  const packagePaths = packagePathsRaw(confPath)
  const pluginPos = plugins
    .map(x => x.constructor.name)
    .indexOf(pluginName)
  if(pluginPos !== -1) {
    const opts = plugins[pluginPos].options
    const Consructor = plugins[pluginPos].constructor
    const paths = {
      ...packagePaths,
      ...((opts.compilerOptions || {}).paths || {}),
      ...tsjsPaths,
    }
    const compilerOptions = {
      ...(opts.compilerOptions || {}),
      paths,
    }
    const options = {...opts, compilerOptions}
    plugins[pluginPos] = new Consructor(options)
  }
}

function aliasJest(aliasMap) {
  const aliasJestInstance = aliasJestSafe(aliasMap)
  return function(config) {
    const expanded = aliasJestInstance(config)
    return {
      ...expanded,
      moduleDirectories: [
        ...(config.moduleDirectories || []),
        path.resolve(paths.appPath, 'node_modules')
      ],
    }
  }
}

function aliasDangerous(aliasMap) {
  const aliasLocal = Object.keys(aliasMap).reduce( (a,i) => {
    a[i] = path.resolve(paths.appPath, aliasMap[i])
    return a
  }, {})
  return function(config) {
    expandResolveAlias(config.resolve, aliasLocal)
    expandRulesInclude(config.module.rules, Object.values(aliasLocal))
    expandPluginsScope(config.resolve.plugins, Object.values(aliasLocal), Object.values(aliasLocal))
    expandPluginsTsChecker(config.plugins, './tsconfig.paths.json')
    return config
  }
}

const CracoAliasPlugin = {
  overrideWebpackConfig: function({webpackConfig, pluginOptions}) {
    return aliasDangerous(pluginOptions.alias||configPaths())(webpackConfig)
  },
  overrideJestConfig: function({jestConfig, pluginOptions}) {
    return aliasJest(pluginOptions.alias||configPaths())(jestConfig)
  }
}

module.exports = {
  aliasDangerous,
  aliasJest,
  configPaths,
  expandResolveAlias,
  expandRulesInclude,
  expandPluginsScope,
  CracoAliasPlugin,
}
