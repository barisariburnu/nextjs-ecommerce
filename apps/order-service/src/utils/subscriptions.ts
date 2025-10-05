import { consumer } from "./kafka";
import { createOrder } from "./order";
import type { OrderMessageType } from "@repo/types";

export const runKafkaSubscriptions = async () => {
  consumer.subscribe<OrderMessageType>("payment.successful", async (message) => {
    const payload = message.value;
    console.log("Received message: payment.successful", payload);

    await createOrder(payload);
  });
};
