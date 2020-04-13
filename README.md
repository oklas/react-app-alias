# Alias solution for rewired create-react-app

This is more than simple alias. This is also multiple project `src`
directory. Currently `create-react-app` does not support more then one
`src` dir in root directory. Monorepo, multirepo, library projects with
examples and etc, requires more then only one directories like `src`.

This is alias and multy-src directory for `create-react-app` and this is not
a replacement for mutipackage management tools like
[lerna](https://github.com/lerna/lerna).

[![Npm package](https://img.shields.io/npm/v/react-app-rewire-alias.svg?style=flat)](https://npmjs.com/package/react-app-rewire-alias)

#### This allows:

* quality and secure exports outside from `src` (identically `src`)
* absolute imports
* any `./dir` at root outside of `src` with babel and etc cra features

#### This is designed for:

* monorepos projects
* multirepos projects
* library projects with examples

Read more about **[rewire](https://github.com/timarney/react-app-rewired)**:
create-react-app webpack config without ejecting

#### Advantages opposite another solutions:

 * provided fully functional aliases and allows to use babel and jsx and
   so on in dirs near to `src` (outside of `src`)

 * provided fully secure aliases and uses same module scope plugin from
   original create-react-app package for modules (instead of remove it),
   to minmize probability to include something what is not wanted for bundle

#### Install

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
  })(config)

  return config
}
```

#### Config paths from *jsconfig.json* | *tsconfig.json*

Config files for aliases mentioned in example above looks like:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "example/*": "example/src/*",
      "@library/*": "library/src/*",
    }
  }
}
```

So to keep aliases in one place load function `configPaths()` is provided.
This function loads paths from *jsconfig.json* | *tsconfig.json* with
slight adaptation. Splitting of loading paths from config and from stage of
apply aliases allows filter some config paths or spread some additional paths

```js
const {alias, configPaths} = require('react-app-rewire-alias')

module.exports = function override(config) {

  alias(configPaths())(config)

  // or with spread and custom config file
  alias({
    ...configPaths('tsconfig.paths.json')
  })(config)

  return config
}
```

#### Short intro into rewire

Integration of rewire into the project is very simple (check
[docs](https://github.com/timarney/react-app-rewired#readme) if you are new).
Just create mentioned above **config-overrides.js** in the project root directory
(near to *package.json* and *src* dir). And rewrite **package.json** like this:

```diff
  "scripts": {
-   "start": "react-scripts start",
+   "start": "react-app-rewired start",
-   "build": "react-scripts build",
+   "build": "react-app-rewired build",
-   "test": "react-scripts test --env=jsdom",
+   "test": "react-app-rewired test --env=jsdom",
    "eject": "react-scripts eject"
}
```

That is all. Now you can continue to use `yarn` or `npm` start/build/test commands but
already with rewired app.

#### Workaround for aliased imports not supported

Create-react-app [overwrites](https://github.com/facebook/create-react-app/blob/v3.4.1/packages/react-scripts/scripts/utils/verifyTypeScriptSetup.js#L242)
your `tsconfig.json` on the fly in runtime. It removes `paths` from `tsconfig.json` due
to `aliased imports is not supported` with message:

> ```
> The following changes are being made to your tsconfig.json file: 
>   - compilerOptions.paths must not be set (aliased imports are not supported)
> ```

The [suggested](https://github.com/facebook/create-react-app/issues/5645#issuecomment-435201019)
workaround solution is to move configuration in a different `.json` file like this:

```json
/* tsconfig.paths.json */
{
  "compilerOptions": {
    "paths": {
      "example/*": "example/src/*",
      "@library/*": "library/src/*",
    }
  }
}
```

with subsequent inclusion using the `extends` features of `tsconfig.json`:

```json
/* tsconfig.json */
{
  "extends": "./tsconfig.paths.json"
}
```
