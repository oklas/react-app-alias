const {aliasWebpack, aliasJest} = require('react-app-alias')

const options = {
  autoscan: 'src',
}

module.exports = aliasWebpack(options)
module.exports.jest = aliasJest(options)