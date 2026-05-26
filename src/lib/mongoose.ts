import mongoose from "mongoose";
import { BotError } from "@/errors/BotErrors";

export async function mongooseConnect(uri: string) {
  try {
    if (!uri) {
      throw BotError.internal("MongoDB URI is not defined in environment variables.", new Error("Missing URI"));
    }
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error: any) {
    console.error("Error connecting to MongoDB:", error);
    throw BotError.internal("Error connecting to MongoDB", error);
  }
}
