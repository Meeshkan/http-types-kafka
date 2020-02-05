http-types-kafka
================



[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/http-types-kafka.svg)](https://npmjs.org/package/http-types-kafka)
[![Downloads/week](https://img.shields.io/npm/dw/http-types-kafka.svg)](https://npmjs.org/package/http-types-kafka)
[![License](https://img.shields.io/npm/l/http-types-kafka.svg)](https://github.com/Meeshkan/http-types-kafka/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g http-types-kafka
$ ht-kafka COMMAND
running command...
$ ht-kafka (-v|--version|version)
http-types-kafka/0.0.0 darwin-x64 node-v10.16.0
$ ht-kafka --help [COMMAND]
USAGE
  $ ht-kafka COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`ht-kafka hello [FILE]`](#ht-kafka-hello-file)
* [`ht-kafka help [COMMAND]`](#ht-kafka-help-command)

## `ht-kafka hello [FILE]`

describe the command here

```
USAGE
  $ ht-kafka hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ ht-kafka hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/Meeshkan/http-types-kafka/blob/v0.0.0/src/commands/hello.ts)_

## `ht-kafka help [COMMAND]`

display help for ht-kafka

```
USAGE
  $ ht-kafka help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.3/src/commands/help.ts)_
<!-- commandsstop -->
