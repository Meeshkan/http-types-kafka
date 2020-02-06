import debug from "debug";
import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";
import * as stream from "stream";
import { HttpExchange, HttpExchangeReader } from "http-types";
import { KafkaConfig, ProducerConfig, Message, Producer, RecordMetadata, Kafka } from "kafkajs";

const debugLog = debug("http-types-kafka:producer");

const resolveFile = (filepath: string): string => {
  return path.resolve(filepath);
};

export class HttpTypesKafkaProducer {
  private readonly topic: string;
  private readonly producer: Producer;
  constructor({ producer, topic }: { producer: Producer; topic: string }) {
    this.topic = topic;
    this.producer = producer;
  }

  /**
   * Create a new HttpTypesKafkaProducer
   * @param opts KafkaConfig, ProducerConfig, and Kafka topic
   */
  public static create({
    kafkaConfig,
    producerConfig,
    topic,
  }: {
    kafkaConfig: KafkaConfig;
    producerConfig?: ProducerConfig;
    topic: string;
  }): HttpTypesKafkaProducer {
    const kafka = new Kafka(kafkaConfig);
    const producer = kafka.producer(producerConfig);
    return new HttpTypesKafkaProducer({ producer, topic });
  }

  public connect(): Promise<void> {
    return this.producer.connect();
  }

  public disconnect(): Promise<void> {
    return this.producer.disconnect();
  }

  public async sendFromFile(filepath: string): Promise<void> {
    const resolvedPath = resolveFile(filepath);

    if (!resolvedPath.endsWith(".jsonl")) {
      throw Error("Only .jsonl files are supported");
    }

    const stat = fs.statSync(resolvedPath);

    if (!stat.isFile()) {
      throw Error(`File does not exist: ${resolvedPath}`);
    }

    const transformToHttpExchange = new stream.Transform({
      writableObjectMode: true,
      readableObjectMode: true,

      transform(chunk, _, callback): void {
        try {
          const exchange = HttpExchangeReader.fromJson(chunk);
          callback(undefined, exchange);
        } catch (err) {
          debugLog("Transform stream caught an error", err);
          callback(new Error(`Failed reading HTTP exchange from JSON: ${err.message}`));
        }
      },
    });

    const fileReadStream = fs
      .createReadStream(resolvedPath, { encoding: "utf-8" })
      .on("end", function() {
        debugLog("All the data in the file has been read");
      })
      .on("close", () => {
        debugLog("Read stream has been destroyed and file has been closed");
      })
      .on("error", err => {
        debugLog("Error reading file stream");
        transformToHttpExchange.emit("error", err);
      });

    const readlinesStream = readline.createInterface({
      input: fileReadStream,
    });

    readlinesStream.on("line", line => {
      transformToHttpExchange.write(line);
    });

    readlinesStream.on("close", () => {
      debugLog("Lines stream exhausted");
      transformToHttpExchange.end();
    });

    await this.sendFromStream(transformToHttpExchange);
  }

  /**
   * Produce from a stream of `HTTPExchange` objects.
   * @param stream Stream where every chunk is an `HTTPExchange` object.
   */
  public async sendFromStream(stream: stream.Readable): Promise<void> {
    for await (const chunk of stream) {
      // debugLog(`Received chunk: ${JSON.stringify(chunk)}`);
      await this.send(chunk);
    }
    debugLog("Done processing stream");
  }

  private static toMessage(exchange: HttpExchange): Message {
    const message = {
      key: exchange.request.host,
      value: JSON.stringify(exchange),
    };
    debugLog(`Created message: ${JSON.stringify(message)}`);
    return message;
  }

  public async sendMany(exchanges: HttpExchange[]): Promise<RecordMetadata[]> {
    debugLog(`Sending ${exchanges.length} messages`);
    return this.producer.send({
      topic: this.topic,
      messages: exchanges.map(exchange => HttpTypesKafkaProducer.toMessage(exchange)),
    });
  }

  public async send(exchange: HttpExchange): Promise<RecordMetadata[]> {
    debugLog("Sending message to ");
    return this.sendMany([exchange]);
  }
}
