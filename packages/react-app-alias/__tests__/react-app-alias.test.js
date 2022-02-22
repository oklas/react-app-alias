'use strict';
const path = require('path')
const {configPathsRaw} = require('../src');

describe('react-app-alias', () => {
  test.todo('tested by tests in projects in example folder');
});

describe('extends section of tsconfig on detect config file stage', () => {
  test('read both file and extends', () => {
    const paths = configPathsRaw(path.resolve(__dirname, './59-tsconfig.json'))
    expect(paths['alias/*'][0]).toBe('target/*');
    expect(paths['alias-paths/*'][0]).toBe('target-paths/*');
  });
});

