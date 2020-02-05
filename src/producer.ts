import debug from "debug";
import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";
import * as stream from "stream";
import { HttpExchange, HttpExchangeReader } from "http-types";
import { Message, Producer, RecordMetadata } from "kafkajs";

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

    const fileReadStream = fs
      .createReadStream(resolvedPath, { encoding: "utf-8" })
      .on("end", function() {
        // This may not been called since we are destroying the stream
        // the first time 'data' event is received
        debugLog("All the data in the file has been read");
      })
      .on("close", function(err) {
        debugLog("Read stream has been destroyed and file has been closed");
      });

    const readlinesStream = readline.createInterface({
      input: fileReadStream,
    });

    const transform = new stream.Transform({
      writableObjectMode: true,
      readableObjectMode: true,

      transform(chunk, _, callback): void {
        // debugLog(`Received chunk: ${chunk}`);
        try {
          const exchange = HttpExchangeReader.fromJson(chunk);
          callback(undefined, exchange);
        } catch (err) {
          callback(err);
        }
      },
    });

    readlinesStream.on("line", line => {
      transform.write(line);
    });

    readlinesStream.on("close", () => {
      debugLog("Lines stream exhausted");
      transform.end();
    });

    readlinesStream.on("error", e => {
      debugLog("Error reading lines");
      transform.emit("error", e);
    });

    await this.sendFromStream(transform);
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
    return {
      key: exchange.request.host,
      value: JSON.stringify(exchange),
    };
  }

  public async sendMany(exchanges: HttpExchange[]): Promise<RecordMetadata[]> {
    debugLog(`Sending ${exchanges.length} messages`);
    return this.producer.send({
      topic: this.topic,
      messages: exchanges.map(exchange => HttpTypesKafkaProducer.toMessage(exchange)),
    });
  }

  public async send(exchange: HttpExchange): Promise<RecordMetadata[]> {
    return this.sendMany([exchange]);
  }
}
