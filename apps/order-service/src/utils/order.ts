import { Order } from "@repo/order-db";
import type { OrderMessageType } from "@repo/types";
import { producer } from "./kafka";

export const createOrder = async (order: OrderMessageType) => {
  const newOrder = new Order(order);

  try {
    const order = await newOrder.save();
    producer.send("order.created", {
      value: {
        email: order.email,
        amount: order.amount,
        status: order.status,
      },
    });
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};
