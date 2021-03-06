omnia-bundler
=============

An in place code transpiler to be used in multi page sites

WIP!! DO NOT USE!!

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/omnia-bundler.svg)](https://npmjs.org/package/omnia-bundler)
[![CircleCI](https://circleci.com/gh/node-cli/omnia-bundler/tree/master.svg?style=shield)](https://circleci.com/gh/node-cli/omnia-bundler/tree/master)
[![Appveyor CI](https://ci.appveyor.com/api/projects/status/github/node-cli/omnia-bundler?branch=master&svg=true)](https://ci.appveyor.com/project/node-cli/omnia-bundler/branch/master)
[![Codecov](https://codecov.io/gh/node-cli/omnia-bundler/branch/master/graph/badge.svg)](https://codecov.io/gh/node-cli/omnia-bundler)
[![Downloads/week](https://img.shields.io/npm/dw/omnia-bundler.svg)](https://npmjs.org/package/omnia-bundler)
[![License](https://img.shields.io/npm/l/omnia-bundler.svg)](https://github.com/node-cli/omnia-bundler/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage

### Requirements

Each configuration will need it's own local dependencies.

To get started with React:
```
$ npm install --save-dev omnia-bundler @babel/preset-env @babel/preset-react babel-loader (to add flow) babel-preset-flow 
```

To get started with Preact:
```
$ npm install --save-dev omnia-bundler @babel/preset-env @babel/plugin-transform-react-jsx babel-loader (to add flow) babel-preset-flow 
```

To get started with Vue:
```
$ npm install --save-dev omnia-bundler @babel/preset-env vue-loader babel-loader style-loader css-loader (to add prop decorators) vue-property-decorator @babel/plugin-proposal-decorators @babel/plugin-proposal-class-properties 
```

<!-- usage -->
```sh-session
$ npm install -g omnia-bundler
$ omnia-bundler COMMAND
running command...
$ omnia-bundler (-v|--version|version)
omnia-bundler/1.0.34 darwin-x64 node-v10.13.0
$ omnia-bundler --help [COMMAND]
USAGE
  $ omnia-bundler COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`omnia-bundler help [COMMAND]`](#omnia-bundler-help-command)
* [`omnia-bundler preact [FILE]`](#omnia-bundler-preact-file)
* [`omnia-bundler react [FILE]`](#omnia-bundler-react-file)
* [`omnia-bundler vue [FILE]`](#omnia-bundler-vue-file)

## `omnia-bundler help [COMMAND]`

display help for omnia-bundler

```
USAGE
  $ omnia-bundler help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.1/src/commands/help.ts)_

## `omnia-bundler preact [FILE]`

describe the command here

```
USAGE
  $ omnia-bundler preact [FILE]

OPTIONS
  -D, --development
  -h, --help         show CLI help
  -w, --flow         Adds flow configuration
```

_See code: [src/commands/preact.ts](https://github.com/node-cli/omnia-bundler/blob/v1.0.34/src/commands/preact.ts)_

## `omnia-bundler react [FILE]`

describe the command here

```
USAGE
  $ omnia-bundler react [FILE]

OPTIONS
  -D, --development
  -h, --help         show CLI help
  -w, --flow         Adds flow configuration
```

_See code: [src/commands/react.ts](https://github.com/node-cli/omnia-bundler/blob/v1.0.34/src/commands/react.ts)_

## `omnia-bundler vue [FILE]`

describe the command here

```
USAGE
  $ omnia-bundler vue [FILE]

OPTIONS
  -D, --development
  -h, --help            show CLI help
  -p, --prop-decorator
```

_See code: [src/commands/vue.ts](https://github.com/node-cli/omnia-bundler/blob/v1.0.34/src/commands/vue.ts)_
<!-- commandsstop -->
