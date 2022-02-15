const {aliasWebpack, aliasJest, configPaths} = require('react-app-alias-ex')

const aliasPaths = configPaths('./tsconfig.paths.json')

module.exports = aliasWebpack(aliasPaths)
module.exports.jest = aliasJest(aliasPaths)