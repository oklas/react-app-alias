const path = require('path')
const paths = require('react-scripts/config/paths')
const {
  aliasJest,
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

function aliasDangerous(aliasMap) {
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
