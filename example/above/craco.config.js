/* eslint-disable */
const { CracoAliasPlugin, configPaths } = require('react-app-alias-ex');
const aliasPaths = configPaths('./tsconfig.paths.json')

module.exports = {
  plugins: [
    {
      plugin: CracoAliasPlugin,
      options: {
        alias: aliasPaths,
      },
    },
  ],
};
