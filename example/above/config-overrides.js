const {aliasDangerous, aliasJest, configPaths} = require('react-app-rewire-alias/lib/aliasDangerous')

const aliasPaths = configPaths('./tsconfig.paths.json')

module.exports = aliasDangerous(aliasPaths)
module.exports.jest = aliasJest(aliasPaths)