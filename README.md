# Alias solution for rewired create-react-app

This is more than simple alias. This is also a multi-project `src`
directory. Currently, `create-react-app` (CRA) does not support more than one
`src` directory in the project. Monorepo, multi-repo and library projects with
examples require more than one directories like `src`.

This is merely an alias and multi-source solution for CRA
and this is not a replacement for multi-package management tools like
[Lerna](https://github.com/lerna/lerna).

This project requires the use of **[react-app-rewired](https://github.com/timarney/react-app-rewired)**,
which allows to overwrite the Webpack configuration
of CRA projects without ejecting them.

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
   outside of `src`

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

Modify **config-overrides.js** like this:

```js
const {alias} = require('react-app-rewire-alias')

module.exports = function override(config) {
  alias({
    example: 'example/src',
    '@library': 'library/src',
  })(config);

  return config;
}
```

This is compatible with [customize-cra](https://github.com/arackaf/customize-cra),
just insert it into the override chain.

#### Using config paths from *jsconfig.json* or *tsconfig.json*

You can also configure your paths in your `jsconfig.json` or `tsconfig.json` like this:

```json
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

To keep aliases in one place, the provided `configPaths()` function
loads the paths from `jsconfig.json` or `tsconfig.json` with slight adaptations.
Use it like this:

```js
const {alias, configPaths} = require('react-app-rewire-alias')

module.exports = function override(config) {
  alias(configPaths())(config);

  return config;
}
```

The `tsconfig.json` is prioritized over the `jsconfig.json` in this scenario.

If you placed the paths in a custom file, use the function like so instead:

```js
const {alias, configPaths} = require('react-app-rewire-alias')

module.exports = function override(config) {
  alias({
    ...configPaths('tsconfig.paths.json')
  })(config);

  return config;
}
```

#### Using react-app-rewired

Integrating `react-app-rewired` into your project is very simple (see the
[docs](https://github.com/timarney/react-app-rewired#readme)).
Just create `config-overrides.js` mentioned above in the project's root directory
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

#### Workaround for "aliased imports are not supported"

CRA [overwrites](/blob/v3.4.1/packages/react-scripts/scripts/utils/verifyTypeScriptSetup.js#L242)
your `tsconfig.json` on at runtime. It removes `paths` from `tsconfig.json`,
which is not officially supported with this message:

> ```
> The following changes are being made to your tsconfig.json file: 
>   - compilerOptions.paths must not be set (aliased imports are not supported)
> ```

The [suggested workaround](https://github.com/oklas/react-app-rewire-alias/issues/3#issuecomment-633947385)
is to move the configuration to a different `.json` file, e.g. `tsconfig.paths.json`, like this:

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

with its subsequent inclusion in the `tsconfig.json` using `extends`:

```json
/* tsconfig.json */
{
  "extends": "./tsconfig.paths.json"
}
```

### Workaround for compile errors on external TypeScript libraries

When using TypeScript libraries located outside the root project's directory,
parsing errors may occur at compile time. This is caused by CRA's ESLint configuration
for TypeScript files uses `overrides`, which does not support external paths.
It incorrectly recognizes these files as JavaScript files and cannot parse them.

A [possible workaround](https://github.com/oklas/react-app-rewire-alias/issues/3#issuecomment-633947385)
is disabling ESLint checking for these files. This can be activated by using `true` as the
second parameter for the `alias` function. Extending the above workaround, it looks like this:

```js
const {alias, configPaths} = require('./config-overrides-alias')

module.exports = function override(config) {
  alias({
    ...configPaths('tsconfig.paths.json')
  }, true)(config);

  return config;
}
```

Because ESLint caches its findings, the incorrect configuration might have caused
cache pollution. To solve this, delete the `eslint` directory under `node_modules/.cache`
and restart your build.
