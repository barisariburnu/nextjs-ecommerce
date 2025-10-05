import { Kafka, Producer } from "kafkajs";
import { KafkaMessage } from "./types";

export const createProducer = (kafka: Kafka) => {
  const producer: Producer = kafka.producer();

  const connect = async () => {
    await producer.connect();
  };

  const send = async <T>(topic: string, message: KafkaMessage<T>) => {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  };

  const disconnect = async () => {
    await producer.disconnect();
  };

  return {
    connect,
    send,
    disconnect,
  };
};
