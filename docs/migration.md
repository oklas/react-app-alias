# Migration

## Migration from react-app-rewired-alias

### Generic mode

* Replace library name for generic mode

```diff
- const {...} = require('react-app-rewire-alias')
+ const {...} = require('react-app-alias')
```

* Rename function `alias` to `aliasWebpack`

```diff
- const {alias} = require('react-app-alias')
+ const {aliasWebpack} = require('react-app-alias')
```

If dangerous mode is not used, scroll dow through next section to continue.

### Dangerous mode

Dangerous mode is renamed to extended/extremal and the implementation
is moved to separated liblrary with suffix **`-ex`**.

* Replace library name for dangerous mode,
* Remove `/lib/aliasDangerous` path part from import,
* Notice that library name is different (suffix `-ex` added),

```diff
- const {...} = require('react-app-rewired-alias/lib/aliasDangerous')
+ const {...} = require('react-app-alias-ex')
```

* For dangerous mode function `aliasDangerous` for `react-app-rewired` or `customize-cra` is renamed to `aliasWebpack` (also same as function `alias` for generic mode).

* Rename function `alias` to `aliasWebpack`

```diff
- const {aliasDangerous} = require('react-app-alias-ex')
+ const {aliasWebpack} = require('react-app-alias-ex')
```

### Options

Before the agrument of `aliasWebpack()` and `aliasJest()` was alias map.
Now the argument of these functions is options.
Alias map now is `alias` option. So replace:

```diff
const aliasMap = configPaths("./tsconfig.paths.json")
// or possible alias map created in code
const aliasMap = {
  '@app': 'src/app',
  '@lib': 'lib',
}

- module.exports = aliasWebpack(aliasMap)
- module.exports.jest = aliasJest(aliasMap)
+ module.exports = aliasWebpack({alias: aliasMap})
+ module.exports.jest = aliasJest({alias: aliasMap})
```

Fucntion `configPaths()` now become needed in rare cases. It is used internally.
Now you can specify path of *tsconfig.json* or *jsconfig.json* as an option.

```diff
- const aliasMap = configPaths("./tsconfig.paths.json")
- module.exports = aliasWebpack({alias: aliasMap})
+ module.exports = aliasWebpack({tsconfig: "./tsconfig.paths.json"})
```

If you uses standart name of these files you can skip it. It will be opned automatically.

```diff
- const aliasMap = configPaths("./jsconfig.paths.json")
- module.exports = aliasWebpack({jsconfig: "./jsconfig.paths.json"})
+ module.exports = aliasWebpack({})
```

