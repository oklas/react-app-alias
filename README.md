# Alias solution for rewired create-react-app

This is more than simple alias. This is also a multi-project `src`
directory. Currently, `create-react-app` (CRA) does not support more than one
`src` directory in the project. Monorepo, multi-repo and library projects with
examples require more than one directories like `src`.

This is merely an alias and multi-source solution for CRA
and this is not a replacement for multi-package management tools like
[Lerna](https://github.com/lerna/lerna).

This requires to modify the CRA webpack configuration in runtime
(without ejecting) and works with one of:
* **[react-app-rewired](https://github.com/timarney/react-app-rewired)**
* **[customize-cra](https://github.com/arackaf/customize-cra)** 
* **[craco](https://github.com/gsoft-inc/craco)** (see [Using craco](#using-craco) below)

[![Npm package](https://img.shields.io/npm/v/react-app-rewire-alias.svg?style=flat)](https://npmjs.com/package/react-app-rewire-alias)
[![Npm downloads](https://img.shields.io/npm/dm/react-app-rewire-alias.svg?style=flat)](https://npmjs.com/package/react-app-rewire-alias)
[![Dependency Status](https://david-dm.org/oklas/react-app-rewire-alias.svg)](https://david-dm.org/oklas/react-app-rewire-alias)
[![Dependency Status](https://img.shields.io/github/stars/oklas/react-app-rewire-alias.svg?style=social&label=Star)](https://github.com/oklas/react-app-rewire-alias)
[![Dependency Status](https://img.shields.io/twitter/follow/oklaspec.svg?style=social&label=Follow)](https://twitter.com/oklaspec)

#### This allows:

* quality and secure exports from outside `src`
* absolute imports
* any `./directory` at root outside of `src` with Babel and CRA features

#### This is designed for:

* monorepo projects
* multi-repo projects
* library projects with examples

#### Advantages over other solutions:

 * provided fully functional aliases and allows the use of Babel, JSX, etc.
   outside of `src` (outside of `root` see section below)

 * provided fully secure aliases and uses the same module scope plugin from
   the original create-react-app package for modules (instead of removing it),
   to minimize the probability of including unwanted code
   
#### Installation

```sh
yarn add --dev react-app-rewired react-app-rewire-alias
```

or

```sh
npm install --save-dev react-app-rewired react-app-rewire-alias
```

#### Usage

Current `create-react-app` and `react-scripts` **v4.0** has a bug which is fixed here:
[create-react-app #9921](https://github.com/facebook/create-react-app/pull/9921) - but
it does released yet. Use previous version of create-react-app/react-scripts or
wait for new release or check commit referenced in #9 to learn how make it worked
using patch-package. 

Place for alias foldes is recommended near to **src**.
Alias folders outside of the root of project is not recommended.

There two approach to configure: `simple` - only with js projects.
Another is `with ts/js config` - for both js and typescript projects.

The simple way is just configure `create-app-rewired` (see below or its docs)
and create **config-overrides.js** like this:

```js
const {alias} = require('react-app-rewire-alias')

module.exports = function override(config) {
  return alias({
    example: 'example/src',
    '@library': 'library/src',
  })(config)
}
```

Using `with ts/js config` includes these steps:

* configure `create-app-rewired` if not yet (short brief below)
* modify **config-overrides.js** to add `react-app-rewire-alias`
* add **extends** section to `jsconfig.json` or `tsconfig.json`
* configure alias in `jsconfig.paths.json` or `tsconfig.paths.json`

#### Modify **config-overrides.js** to add `react-app-rewire-alias`

```js
const {alias, configPaths} = require('react-app-rewire-alias')

module.exports = function override(config) {
  alias(configPaths('./tsconfig.paths.json'))(config)

  return config
}
```

#### Add **extends** section to **jsconfig.json** or **tsconfig.json**

The **paths** section must not be configured directly in `jsconfig.json` or `tsconfig.json`
but in separated extends file.

Specify **extends** section

```js
// jsconfig.json or tsconfig.json
{
  "compilerOptions": {
    // ...
    "extends": "./tsconfig.paths.json", // or "./tsconfig.paths.json"
  }
}
```

#### Configure alias in **jsconfig.paths.json** or **tsconfig.paths.json**

Create separated file `jsconfig.paths.json` or `tsconfig.paths.json`, like this:

```js
// jsconfig.paths.json or tsconfig.paths.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "example/*": ["example/src/*"],
      "@library/*": ["library/src/*"]
    }
  }
}
```

#### Using react-app-rewired

Integrating `react-app-rewired` into your project is very simple
(see [its documentation](https://github.com/timarney/react-app-rewired#readme)):
Create `config-overrides.js` mentioned above in the project's root directory
(the same including the `package.json` and `src` directory)
and rewrite the `package.json` like this:

```diff
  "scripts": {
-   "start": "react-scripts start",
+   "start": "react-app-rewired start",
-   "build": "react-scripts build",
+   "build": "react-app-rewired build",
-   "test": "react-scripts test",
+   "test": "react-app-rewired test",
    "eject": "react-scripts eject"
}
```

That is all. Now you can continue to use `yarn` or `npm` start/build/test commands as usual.

#### Using craco

```js
// craco.config.js

const {CracoAliasPlugin, configPaths} = require('react-app-rewire-alias')

module.exports = {
  plugins: [
    {
      plugin: CracoAliasPlugin,
      options: {alias: configPaths('./tsconfig.paths.json')}
    }
  ]
}
```



#### API

* **alias(aliasMap)(webpackConfig)**

The function `alias()` accepts aliases declared in form:

```js
{
  example: 'example/src',
  '@library': 'library/src',
}
```

To make all things worked, aliases must be declared in `jsconfig.json` or `tsconfig.json`.
However it must beclared in separated extends file (see section `Workaround for
"aliased imports are not supported"` below)

The result is function which modify wepack config  

* **configPaths()**

The function `configPaths()` loads paths from file compatible with `jsconfig.json`
or `tsconfig.json` and returns path in form acceptable for `alias()` function.
The `tsconfig.json` is prioritized over the `jsconfig.json` in loading sequence.

#### Workaround for "aliased imports are not supported"

CRA [overwrites](/blob/v3.4.1/packages/react-scripts/scripts/utils/verifyTypeScriptSetup.js#L242)
your `tsconfig.json` at runtime and removes `paths` from the `tsconfig.json`,
which is not officially supported, with this message:

> ```
> The following changes are being made to your tsconfig.json file: 
>   - compilerOptions.paths must not be set (aliased imports are not supported)
> ```

The [suggested workaround](https://github.com/facebook/create-react-app/issues/5645#issuecomment-435201019)
is to move the paths to a different `.json` file, e.g. `tsconfig.paths.json`, like this:

```json
/* tsconfig.paths.json */
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "example/*": ["example/src/*"],
      "@library/*": ["library/src/*"]
    }
  }
}
```

with that file's subsequent inclusion in the `tsconfig.json` using `extends`:

```json
/* tsconfig.json */
{
  "extends": "./tsconfig.paths.json"
}
```

## Outside of root

The base alias implementation supports aliases near `src` and in `src` directory. It
provides aliases with same feature set as original `create-react-app`. As far
`create-react-app` does not supports aliases and additional `src`-like directories as
it does not supports aliases outside of the `root` project directory.

Aliases outside or project `root` directory may be implemented with some
[limitation](https://github.com/oklas/react-app-rewire-alias/issues/3#issuecomment-633947385)
of feature set. That is solved by disabling ESLint checking.

This mplementation is moved to separated code set named `aliasDangerous` to be not confused
with `alias`. To use it husr replace import like this:

```diff
- const {alias, configPaths, CracoAliasPlugin} = require('react-app-rewire-alias')
+ const {aliasDangerous, configPaths, CracoAliasPlugin} = require('react-app-rewire-alias/lib/aliasDangerous')
```

And replace `alias` with `aliasDangerous`:

```js
module.exports = function override(config) {
  aliasDangerous({
    ...configPaths('tsconfig.paths.json')
  })(config)
     
  return config
}
 ```

## Tips

* **keep only one `node_modules` directory** 

Confusions in deps versions may bring unclear errors or problems. For example application
is not working without any error. Or another example is error in `react-router` - `<Route>`
component do not see `<Router>` when actually code is correct and it falls with:

> should not use Route or withRouter() outside a Router

This may be a result of some confusions in `node_modules` folders of multirepo projects.
Same take place in plain `create-react-app` if some how one or more additional
`node_modulest` directory appers in `src`. 

To avoid this problems **use only one main project `node_modules` directory**.

* **keep away from working with nested project**

Default bundler configuration doesn't assume your configuration and may mix deps from
`node_modules` from different projects (top project and nested project) so this may
bring mentioned above confusions with deps versions. To avoid problems: 
**do not install and run within nested project directly when it is nested or integrated
in another one - but only independent toplevel configuration** Or consider to eject
or configure webpack manually.

* **do not relay to deps versions synchronization**

Some libraryes uses `instanceof` and other type comparisions. For example two objects
created with same params in same code of same library version but installed in
differenent `node_modules` and bundled separately - will mostly have same data and same
behaviour but differen instance type. Such libraries will be unable to recognize its own
objects and will lead to unpredictable behaviour. So **use only one main project
`node_modules` directory**.
