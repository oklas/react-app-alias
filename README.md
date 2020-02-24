# Alias solution for rewired create-react-app

#### This allows:

* quality and secure exports outside from src
* absolute imports

#### This is designed for:

* monorepos projects
* multirepos projects
* library projects with react examples

Read more about **[rewire](https://github.com/timarney/react-app-rewired)**:
create-react-app webpack config without ejecting

#### Advantages opposite another solutions:

 * provided aliases fully functional and allows to use babel and jsx and
   so on in dirs near to src (outside of it)

 * provided aliases fully secure and uses same scope plugin from original
   create-react-app package for modules (instead of remove it), to minmize
   probability to include something what is not wanted for bundle

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

#### Additional configurations *jsconfig.json* | *tsconfig.json*

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