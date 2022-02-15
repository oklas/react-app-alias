# Migration

# Migration from react-app-rewired-alias

Dangerous mode is renamed to extended/extremal. The implementation
for dangerous mode is moved to separaded liblrary with suffix **`-ex`**.

* Replace library name for generic mode

```diff
- const {alias} = require('react-app-rewire-alias')
+ const {alias} = require('react-app-alias')
```

* Replace library name for dangerous mode,
* Remove `/lib/aliasDangerous` path part from import,
* Notice that library name is different (suffix `-ex` added),
* Fangerous mode function `aliasDangerous` for `react-app-rewired` or `customize-cra` is renamed to `alias`.

```diff
- const {aliasDangerous} = require('react-app-rewired-alias/lib/aliasDangerous')
+ const {alias} = require('react-app-alias-ex')
```

