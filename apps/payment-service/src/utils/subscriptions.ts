import { StripeProductType } from "@repo/types";
import { consumer } from "./kafka";
import { createStripeProduct, deleteStripeProduct } from "./stripeProduct";

export const runKafkaSubscriptions = async () => {
  consumer.subscribe<StripeProductType>("product.created", async (message) => {
    const product = message.value;
    console.log("Received message: product.created", product);

    await createStripeProduct(product);
  });

  consumer.subscribe<number>("product.deleted", async (message) => {
    const productId = message.value;
    console.log("Received message: product.deleted", productId);

    await deleteStripeProduct(productId);
  });
};
