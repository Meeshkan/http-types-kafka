import { KafkaConfig, ProducerConfig } from "kafkajs";
import { HttpTypesKafkaProducer } from "../src";
import { HttpExchange, HttpRequestBuilder, HttpResponse, HttpHeaders, HttpProtocol, HttpMethod } from "http-types";

const TEST_TOPIC = "http_types_kafka_test";

describe("HttpTypesKafkaProducer", () => {
  const kafkaConfig: KafkaConfig = { brokers: ["localhost:9092"] };
  const producerConfig: ProducerConfig = { idempotent: false };
  let producer: HttpTypesKafkaProducer;
  const request = HttpRequestBuilder.fromPath({
    method: HttpMethod.GET,
    protocol: HttpProtocol.HTTPS,
    host: "example.org",
    path: "/v1",
    headers: {},
  });
  const response: HttpResponse = {
    statusCode: 200,
    body: "",
    headers: new HttpHeaders(),
  };
  const exchange: HttpExchange = {
    request,
    response,
  };
  beforeAll(async () => {
    producer = HttpTypesKafkaProducer.create({ kafkaConfig, producerConfig, topic: TEST_TOPIC });
    await producer.connect();
  });

  it("should put messages to the given topic", async () => {
    return producer.send(exchange);
  });

  afterAll(async () => {
    await producer.disconnect();
  });
});
