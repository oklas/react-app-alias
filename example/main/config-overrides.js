const {alias, aliasJest, configPaths} = require('react-app-rewire-alias')

const aliasPaths = configPaths('./tsconfig.paths.json')

module.exports = alias(aliasPaths)
module.exports.jest = aliasJest(aliasPaths)