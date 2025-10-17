import { Consumer, Kafka } from "kafkajs";
import type { KafkaMessage } from "./types";

export const createConsumer = (kafka: Kafka, groupId: string) => {
  const consumer: Consumer = kafka.consumer({
    groupId,
  });

  const connect = async () => {
    await consumer.connect();
    console.log("Consumer connected:", groupId);
  };

  const subscribe = async <T>(
    topics: {
      topicName: string;
      topicHandler: (message: KafkaMessage<T>) => Promise<void>;
    }[]
  ) => {
    await consumer.subscribe({
      topics: topics.map((topic) => topic.topicName),
      fromBeginning: true,
    });
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const topicConfig = topics.find((t) => t.topicName === topic);
          if (topicConfig) {
            const value = message.value?.toString();

            if (value) {
              await topicConfig.topicHandler(JSON.parse(value));
            }
          }
        } catch (error) {
          console.error("Error processing message:", error);
        }
      },
    });
  };

  const disconnect = async () => {
    await consumer.disconnect();
    console.log("Consumer disconnected:", groupId);
  };

  return {
    connect,
    subscribe,
    disconnect,
  };
};
