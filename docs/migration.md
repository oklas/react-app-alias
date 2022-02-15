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


