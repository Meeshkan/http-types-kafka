import { Command, flags } from "@oclif/command";
import { HttpTypesKafkaProducer } from "../producer";
import { KafkaConfig } from "kafkajs";

const CLIENT_ID = "http-types-producer";

export default class Producer extends Command {
  static description = "describe the command here";

  static flags = {
    help: flags.help({ char: "h" }),
    // flag with a value (-n, --name=VALUE)
    file: flags.string({ description: "Path to JSONL file", required: true }),
    topic: flags.string({ description: "Kafka topic", required: true }),
    brokers: flags.string({ char: "b", description: "Kafka brokers, comma-separated", default: "localhost:9092" }),
  };

  static args = [{ name: "file" }];

  async run(): Promise<void> {
    const { flags } = this.parse(Producer);

    const file = flags.file;
    const topic = flags.topic;
    const brokers = flags.brokers.split(",");

    this.log(`Producing from file ${file}`);

    const kafkaConfig: KafkaConfig = {
      clientId: CLIENT_ID,
      brokers,
    };

    const producer = HttpTypesKafkaProducer.create({ kafkaConfig, topic });

    await producer.connect();
    this.log("Kafka producer connected");

    try {
      await producer.sendFromFile(file);
      this.log("Successfully consumed file.");
    } catch (err) {
      this.log("Producer failed", err);
    } finally {
      await producer.disconnect();
      this.log("Kafka producer disconnected");
    }
  }
}
