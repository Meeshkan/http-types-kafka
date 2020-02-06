# http-types-kafka

[![github](https://github.com/Meeshkan/http-types-kafka-node/workflows/Node.js%20CI/badge.svg)](https://github.com/Meeshkan/http-types-kafka-node/actions?query=workflow%3A%22Node.js+CI%22)
[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/http-types-kafka.svg)](https://npmjs.org/package/http-types-kafka)
[![Downloads/week](https://img.shields.io/npm/dw/http-types-kafka.svg)](https://npmjs.org/package/http-types-kafka)
[![License](https://img.shields.io/npm/l/http-types-kafka.svg)](https://github.com/Meeshkan/http-types-kafka/blob/master/package.json)

Tools for writing [ts-http-types](https://github.com/Meeshkan/ts-http-types) to [Kafka](https://kafka.apache.org/) in Node.js, powered by [kafka.js](https://kafka.js.org/).

## Producer example

First create the topic you're writing to:

```bash
$ kafka-topics.sh --bootstrap-server localhost:9092 --topic express_recordings --create --partitions 3 --replication-factor 1
```

Create a `HttpTypesKafkaProducer` and connect to Kafka:

```ts
// Create a `KafkaConfig` instance (from kafka.js)
const brokers = ["localhost:9092"];
const kafkaConfig: KafkaConfig = {
  clientId: "client-id",
  brokers,
};

// Specify the topic
const kafkaTopic = "express_recordings";

// Create the producer
const producer = HttpTypesKafkaProducer.create({ kafkaConfig, topic: kafkaTopic });

// Connect to Kafka
await producer.connect();
```

Send a single `HttpExchange` to Kafka:

```ts
const exchange: HttpExchange = ...;
await producer.send(exchange);
```

Send multiple `HttpExchanges`:

```ts
const exchanges: HttpExchange[] = ...;
await producer.sendMany(exchanges);
```

Send recordings from a JSON lines file, where every line is a JSON-encoded `HttpExchange`:

```ts
await producer.sendFromFile("recordings.jsonl");
```

Finally, disconnect:

```ts
await producer.disconnect();
```

Delete the topic if you're done:

```bash
$ kafka-topics.sh --bootstrap-server localhost:9092 --topic express_recordings --delete
```

# Command-line interface

# Usage

<!-- usage -->

```sh-session
$ npm install -g @meeshkanml/http-types-kafka
$ ht-kafka COMMAND
running command...
$ ht-kafka (-v|--version|version)
@meeshkanml/http-types-kafka/0.0.0 darwin-x64 node-v10.16.0
$ ht-kafka --help [COMMAND]
USAGE
  $ ht-kafka COMMAND
...
```

<!-- usagestop -->

# Commands

<!-- commands -->

- [`ht-kafka help [COMMAND]`](#ht-kafka-help-command)
- [`ht-kafka producer [FILE]`](#ht-kafka-producer-file)

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

## `ht-kafka producer [FILE]`

describe the command here

```
USAGE
  $ ht-kafka producer [FILE]

OPTIONS
  -b, --brokers=brokers  [default: localhost:9092] Kafka brokers, comma-separated
  -h, --help             show CLI help
  --file=file            (required) Path to JSONL file
  --topic=topic          (required) Kafka topic
```

_See code: [src/commands/producer.ts](https://github.com/Meeshkan/http-types-kafka/blob/v0.0.0/src/commands/producer.ts)_

<!-- commandsstop -->
