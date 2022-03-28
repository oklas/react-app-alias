# Alias solution for craco or rewired create-react-app

This is more than simple alias. This is also a multi-project `src`
directory. Currently, `create-react-app` (CRA) does not support more than one
`src` directory in the project. Monorepo, multi-repo and library projects with
examples require more than one directory like `src`.

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
* any `./directory` at root outside of `src` with Babel/Typescript and all CRA features

#### This is designed for:

* monorepo projects
* multi-repo projects
* library projects with examples

#### Advantages over other solutions:

 * provided fully functional aliases and allows the use of Babel, JSX, etc.
   outside of `src` (outside of project `root` may be enbled with special way
   see the section below)

 * provided fully secure aliases and uses the same module scope plugin from
   the original create-react-app package for modules (instead of removing it),
   to minimize the probability of including unwanted code

#### Installation

```sh
yarn add --dev react-app-alias
```

or

```sh
npm install --save-dev react-app-alias
```

### Usage

By default folders for alias may be near to **src** folder or in it.
Outside of project `root` is implemented in `react-app-alias-ex` (suffix `-ex`).

Usage steps:

* enumerate aliases in *jsconfig.paths.json* or *tsconfig.paths.json*
* include it in *jsconfig.json* or *tsconfig.json*
* enable your favorite any of *react-app-rewired* or *craco*
* apply react-app-alias in config

#### Enumerate aliases in **jsconfig.paths.json** or **tsconfig.paths.json**

Create a separate file `jsconfig.paths.json` or `tsconfig.paths.json`, like this:

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

#### Add **extends** section to **jsconfig.json** or **tsconfig.json**

The **paths** section must not be configured directly in `jsconfig.json`
or `tsconfig.json`, but in a separate extends file mentioned above.
Now include this file in **extends** section, like this:

```js
// jsconfig.json or tsconfig.json
{
  "extends": "./jsconfig.paths.json", // or "./tsconfig.paths.json"
  "compilerOptions": {
    // ...
  }
}
```

### Configure plugin for craco or react-app-rewired

* **`react-app-rewired`**

```js
// config-overrides.js
const {aliasWebpack, aliasJest} = require('react-app-alias')

const options = {} // default is empty for most cases

module.exports = aliasWebpack(options)
module.exports.jest = aliasJest(options)
```

* **`craco`**

```js
// craco.config.js

const {CracoAliasPlugin} = require('react-app-alias')

const options = {} // default is empty for most cases

module.exports = {
  plugins: [
    {
      plugin: CracoAliasPlugin,
      options: {}
    }
  ]
}
```


#### Enable craco or react-app-rewired

* **`react-app-rewired`**

Integrating `react-app-rewired` into your project is simple
(see [its documentation](https://github.com/timarney/react-app-rewired#readme)):
Create `config-overrides.js` mentioned above, in the project's root directory
(the same including the `package.json` and `src` directory).
Install `react-app-rewired` 

```sh
yarn add --dev react-app-rewired
- or -
npm install --save-dev react-app-rewired
```
and rewrite the `package.json` like this:

```diff
  "scripts": {
-   "start": "react-scripts start",
+   "start": "react-app-rewired start",
+   ... // same way
  }
```

* **`craco`**

According to [craco](https://github.com/gsoft-inc/craco/blob/master/packages/craco/README.md#installation)
docs install craco:

```sh
yarn add --dev craco
- or -
npm install --save-dev craco
``` 

and replace `react-scripts` in `package.json`:

```diff
  "scripts": {
-   "start": "react-scripts start",
+   "start": "craco start",
+   ... // same way
  }
```


#### Using baseUrl

* **`baseUrl = '.'`**

  * able to create alias outside of `src` (near `src`)
  * for each directory in `src` alias **does not** created automatically (must be declared manually)

* **baseUrl = 'src'**

  * alias outside of `src` is not possible, only in directory specified in `baseUrl`
  * for each folder in `src` alias created automatically with same name as folder

See also experimental [autoscan](https://github.com/oklas/react-app-alias/issues/70) feature


#### API

* **options**

```ts
  Options {
    alias?: { [alias: string]: string }; // optional alias map
    tsconfig?: string, // optional tsconfig.json path
    jsconfig?: string, // optional jsconfig.json path
    baseUrl?: string, // optional by default from config
  }
```

  // optional alias map has following form:  
  const alias = {
    example: 'example/src',
    '@library': 'library/src',
  }


* **aliasWebpack(options)(webpackConfig)**

The function `aliasWebpack()` accepts aliases declared in form:

```js
const aliasMap = {
  example: 'example/src',
  '@library': 'library/src',
}

const options = {
  alias: aliasMap,
}

module.exports = aliasWebpack(options)
module.exports.jest = aliasJest(options)
```

To make all things worked, aliases must be declared in `jsconfig.json` or `tsconfig.json`.
However, it must be declared in a separate extends file (see section `Workaround for
"aliased imports are not supported"` below)

The result is a function which will modify Wepack config

* **configPaths()**

The function `configPaths()` loads paths from file compatible with `jsconfig.json`
or `tsconfig.json` and returns path in form acceptable for `aliasWebpack()` function.
The `tsconfig.json` is prioritized over the `jsconfig.json` in the loading sequence.

```js
const aliasMap = configPaths('./tsconfig.paths.json')

const options = {
  alias: aliasMap,
}

module.exports = aliasWebpack(aliasMap)
```

* **extendability**

As any `react-app-rewire` or `customize-cra` rewire extension this can be integrated
with another:

```js
module.exports = function override(config) {
  const modifiedConfig = aliasWebpack(...)(config)
  ...
  return someElse(modifiedConfig)
}
module.exports.jest = function override(config) {
  const modifiedConfig = aliasJest(...)(config)
  ...
  return modifiedConfig
}
```

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

Alias folders outside of the root of the project currently fully functional and
works fine but are not recommended. It may bring hard-to-detect errors.

Alias with support of **Outside of root** is implemented in separated library:

`react-app-alias-ex`

with identical API, just install and add suffix `-ex` in import statement:

```diff
- const {aliasWebpack, CracoAliasPlugin} = require('react-app-alias')
+ const {aliasWebpack, CracoAliasPlugin} = require('react-app-alias-ex')
```

## Tips

* **keep only one `node_modules` directory**

Confusions in deps versions may bring unclear errors or problems. For example, an application
is not working without any error. Or another example is error in `react-router` - `<Route>`
component do not see `<Router>` when actually code is correct and it falls with:

> should not use Route or withRouter() outside a Router

This may be a result of some confusion in `node_modules` folders for multi-repo projects.
Same take place in plain `create-react-app` if somehow one or more additional
`node_modulest` directories appear in `src`.

To avoid this problem **use only one main project `node_modules` directory**.

* **keep away from working with nested project**

Default bundler configuration doesn't assume your configuration and may mix deps from
`node_modules` from different projects (top project and nested project) so this may
bring mentioned above confusions with deps versions. To avoid problems:
**do not install and run within nested project directly when it is nested or integrated
in another one - but only independent top level configuration** Or consider to eject
or configure Webpack manually.

* **do not relay to deps versions synchronization**

Some libraries use `instanceof` and other type comparisions. For example , two objects
created with the same params in the same code of the same library version but installed in
different `node_modules` and bundled separately - will mostly have the same data and same
behaviour but different instance type. Such libraries will be unable to recognize their own
objects and will lead to unpredictable behaviour. So **use only one main project
`node_modules` directory**.
