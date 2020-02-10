# http-types-kafka

[![github](https://github.com/Meeshkan/http-types-kafka-node/workflows/Node.js%20CI/badge.svg)](https://github.com/Meeshkan/http-types-kafka-node/actions?query=workflow%3A%22Node.js+CI%22)
[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@meeshkanml/http-types-kafka.svg)](https://npmjs.org/package/@meeshkanml/http-types-kafka)
[![Downloads/week](https://img.shields.io/npm/dw/@meeshkanml/http-types-kafka.svg)](https://npmjs.org/package/@meeshkanml/http-types-kafka)
[![License](https://img.shields.io/npm/l/@meeshkanml/http-types-kafka.svg)](https://github.com/Meeshkan/http-types-kafka/blob/master/package.json)

Tools for writing [ts-http-types](https://github.com/Meeshkan/ts-http-types) to [Kafka](https://kafka.apache.org/) in Node.js, powered by [kafka.js](https://kafka.js.org/).

## Quick start

First create the topic you're writing to:

```bash
$ kafka-topics.sh --bootstrap-server localhost:9092 --topic express_recordings --create --partitions 3 --replication-factor 1
```

Note that you may need to change script name depending on how you installed Kafka.

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

## Command-line interface

See available commands:

```bash
$ http-types-kafka
```

### Producer

First create the destination topic in Kafka.

To send recordings from `recordings.jsonl` to Kafka, run:

```bash
$ http-types-kafka producer --file=recordings.jsonl --topic=my_recordings
```

## Development

Install dependencies:

```bash
$ yarn
```

Build a package in `lib`:

```bash
$ yarn compile
```

Run tests:

```bash
$ ./docker-start.sh  # Start Kafka and zookeeper
$ yarn test
$ ./docker-stop.sh  # Once you're done
```

Package for `npm`:

```bash
$ npm pack
```

Publish to `npm`:

```bash
$ npm publish --access public --dry-run
```

Remove `--dry-run` once you're sure you want to publish.

Push `git` tags:

```bash
$ TAG=v`cat package.json | grep version | awk 'BEGIN { FS = "\"" } { print $4 }'`
$ git tag -a $TAG -m $TAG
$ git push origin $TAG
```

### Working with local Kafka

First start `kafka` and `zookeeper`:

```bash
# See `docker-compose.yml`
docker-compose up
```

Create a topic called `http_types_kafka_test`:

```bash
docker exec kafka1 kafka-topics --bootstrap-server kafka1:9092 --topic http_types_kafka_test --create --partitions 3 --replication-factor 1
```

Check the topic exists:

```bash
docker exec kafka1 kafka-topics --bootstrap-server localhost:9092 --list
```

Describe the topic:

```bash
docker exec kafka1 kafka-topics --bootstrap-server localhost:9092 --describe --topic http_types_kafka_test
```

#### Using [kafkacat](https://github.com/edenhill/kafkacat)

List topics:

```bash
kafkacat -b localhost:9092 -L
```

Push data to topic from file with `snappy` compression:

```bash
tail -f tests/resources/recordings.jsonl | kafkacat -b localhost:9092 -t http_types_kafka_test -z snappy
```

Consume messages from topic to console:

```bash
kafkacat -b localhost:9092 -t http_types_kafka_test -C
```
