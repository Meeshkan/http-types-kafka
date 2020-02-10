# http-types-kafka

[![github](https://github.com/Meeshkan/http-types-kafka-node/workflows/Node.js%20CI/badge.svg)](https://github.com/Meeshkan/http-types-kafka-node/actions?query=workflow%3A%22Node.js+CI%22)
[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/http-types-kafka.svg)](https://npmjs.org/package/http-types-kafka)
[![Downloads/week](https://img.shields.io/npm/dw/http-types-kafka.svg)](https://npmjs.org/package/http-types-kafka)
[![License](https://img.shields.io/npm/l/http-types-kafka.svg)](https://github.com/Meeshkan/http-types-kafka/blob/master/package.json)

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

## Running tests

First start `kafka`:

```bash
# Host IP needed for Kafka networking
export HOST_IP=$(ifconfig | grep -E "([0-9]{1,3}\.){3}[0-9]{1,3}" | grep -v 127.0.0.1 | awk '{ print $2 }' | cut -f2 -d: | head -n1)

# Start `docker-compose.yml` with `HOST_IP`
docker-compose up
```
