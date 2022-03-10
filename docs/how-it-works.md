# How it works

The library `create-react-app` is an executable that generates minimal simple apps with
`react-scripts` dependency. The `react-scripts` is a complicated library that has webpack
and jest and other configuration files. It makes app simple by doing all the complicated
work it configures webpack with plugins and loaders, configure jest, etc.

If someone wants to modify configuration, react-scripts suggests eject command.
Eject copys all mentioned config files to your project so you can modify it.
But after eject the project owner must update and fix configuration which requires
knowledge and attention to packages updates and security fixes. Updating `react-sctipt`
is more simple but it is not possible after eject.

The library `react-scripts` does not provide a way to get runtime configs and do some
fixes. There are some libraries like `react-app-rewired`, `customize-cra`, `craco` that do
runtime patch configs of `react-scripts` and pass final config to user function to modify.

The react-app-alias library confgures aliases in runtime.
