import sendMail from "./utils/mailer";
import { createConsumer, createKafkaClient } from "@repo/kafka";

const kafka = createKafkaClient("email-service");
const consumer = createConsumer(kafka, "email-service");

const start = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe([
      {
        topicName: "user.created",
        topicHandler: async (message) => {
          const { email, username } = message.value as {
            email: string;
            username: string;
          };
          if (email) {
            await sendMail({
              email,
              subject: "Welcome to NextJS Ecommerce",
              text: `Hello ${username || email}, welcome to NextJS Ecommerce!`,
            });
          }
        },
      },
      {
        topicName: "order.created",
        topicHandler: async (message) => {
          const { email, amount, status } = message.value as {
            email: string;
            amount: number;
            status: string;
          };
          if (email) {
            await sendMail({
              email,
              subject: "Order has been created",
              text: `Hello ${email}, your order of ${amount / 100} has been ${status}!`,
            });
          }
        },
      },
    ]);
  } catch (error) {
    console.error("Email service failed to start", error);
  }
};

start();
