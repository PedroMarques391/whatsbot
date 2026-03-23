import { client } from "@/bot";
import mongoose from "mongoose";

const safeShutdown = async (): Promise<void> => {
  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log("Mongoose desconectado com sucesso.");
    }
    await client.destroy();
    console.log("Puppeteer/WhatsApp Web encerrado com sucesso.");
  } catch (error) {
    console.error("Erro ao desligar:", error);
  } finally {
    process.exit(0);
  }
};

export { safeShutdown };
