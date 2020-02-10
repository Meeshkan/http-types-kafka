#!/usr/bin/env bash
set -eux

docker-compose up -d 

sleep 10

TOPIC_NAME=http_types_kafka_test

docker exec kafka1 kafka-topics --bootstrap-server kafka1:9092 --topic ${TOPIC_NAME} --create --partitions 3 --replication-factor 1
