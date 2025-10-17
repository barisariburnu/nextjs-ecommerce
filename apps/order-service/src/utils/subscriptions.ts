import { consumer } from "./kafka";
import { createOrder } from "./order";
import type { OrderMessageType } from "@repo/types";

export const runKafkaSubscriptions = async () => {
  await consumer.subscribe([
    {
      topicName: "payment.successful",
      topicHandler: async (message) => {
        const payload = message.value as OrderMessageType;
        console.log("Received message: payment.successful", payload);

        await createOrder(payload);
      },
    },
  ]);
};
