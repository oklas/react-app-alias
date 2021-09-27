const { alias, configPaths } = require('react-app-rewire-alias');

module.exports = {
    webpack(config, env) {
        config.module.rules.push({
            test: /\.wasm$/,
            loader: 'base64-loader',
            type: 'javascript/auto',
        });

        config.module.rules.forEach((rule) => {
            (rule.oneOf || []).forEach((oneOf) => {
                if (oneOf.loader && oneOf.loader.indexOf('file-loader') >= 0) {
                    oneOf.exclude.push(/\.wasm$/);
                }
            });
        });
        const aliasMap = configPaths('./tsconfig.paths.json');
        alias(aliasMap)(config);
        return config;
    },
};