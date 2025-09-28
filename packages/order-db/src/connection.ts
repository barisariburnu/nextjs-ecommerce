import mongoose from "mongoose";

let isConnected = false;

export const connectOrderDB = async () => {
  if (!process.env.MONGO_URL) {
    throw new Error("MONGO_URL is not defined");
  }

  try {
    if (isConnected) {
      console.log("Order DB is already connected");
      return;
    }
    await mongoose.connect(process.env.MONGO_URL);
    isConnected = true;
    console.log("Order DB connected successfully");
  } catch (error) {
    console.error("Error connecting to order DB:", error);
    throw error;
  }
};
