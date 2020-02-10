#!/usr/bin/env bash

docker-compose up -d 

sleep 10

docker exec kafka1 kafka-topics --bootstrap-server kafka1:9092 --topic test_topic_1 --create --partitions 3 --replication-factor 1
