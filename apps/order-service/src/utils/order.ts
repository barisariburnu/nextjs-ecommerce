import { Order } from "@repo/order-db";
import type { OrderMessageType } from "@repo/types";

export const createOrder = async (order: OrderMessageType) => {
  const newOrder = new Order(order);

  try {
    await newOrder.save();
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};
