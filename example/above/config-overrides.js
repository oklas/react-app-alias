const {aliasDangerous, aliasJest, configPaths} = require('react-app-alias-ex')

const aliasPaths = configPaths('./tsconfig.paths.json')

module.exports = aliasDangerous(aliasPaths)
module.exports.jest = aliasJest(aliasPaths)