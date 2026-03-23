import mongoose from "mongoose";

export async function mongooseConnect(uri: string) {
  try {
    if (!uri) {
      throw new Error("MongoDB URI is not defined in environment variables.");
    }
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}
