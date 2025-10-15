import { OrderSchemaType } from "@repo/order-db";
import type { OrderStatus } from "@repo/order-db";

export type OrderType = OrderSchemaType & {
  _id: string;
};

export type OrderProductItemType = {
  name: string;
  quantity: number;
  price: number;
};

export type OrderMessageType = {
  userId: string;
  email: string;
  amount: number;
  status: (typeof OrderStatus)[number];
  products: OrderProductItemType[];
};

export type OrderChartType = {
  month: string;
  total: number;
  successful: number;
};
