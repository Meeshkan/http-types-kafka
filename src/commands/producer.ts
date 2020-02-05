import { Command, flags } from "@oclif/command";
import { HttpTypesKafkaProducer } from "../producer";
import { Kafka } from "kafkajs";

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

    const kafka = new Kafka({
      clientId: "my-app",
      brokers,
    });

    const kafkaProducer = kafka.producer();

    const producer = new HttpTypesKafkaProducer({ producer: kafkaProducer, topic });
    await producer.connect();

    await producer.sendFromFile(file);
    await producer.disconnect();
  }
}
