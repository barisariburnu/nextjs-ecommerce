import { Hono } from "hono";
import Stripe from "stripe";
import stripe from "../utils/stripe";
import { producer } from "../utils/kafka";
import type { OrderMessageType } from "@repo/types";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;
const webhookRoute = new Hono();

webhookRoute.post("/stripe", async (c) => {
  const stripeEvent = await c.req.json();
  const sig = c.req.header("stripe-signature");

  let event: Stripe.Event;

  try {
    event = Stripe.webhooks.constructEvent(stripeEvent, sig!, webhookSecret);
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return c.json({ message: "Webhook verification failed", error: err }, 400);
  }

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;

      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id
      );

      const payload: OrderMessageType = {
        userId: session.client_reference_id ?? "",
        email: session.customer_details?.email ?? "",
        amount: session.amount_total ?? 0,
        status: session.payment_status === "paid" ? "success" : "failed",
        products: lineItems.data.map((item) => ({
          name: item.description ?? "",
          quantity: item.quantity ?? 0,
          price: item.price?.unit_amount ?? 0,
        })),
      };

      producer.send<OrderMessageType>("payment.successful", {
        value: payload,
      });
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
      break;
  }

  return c.json({
    message: "Webhook received",
    event: event,
  });
});

export default webhookRoute;
