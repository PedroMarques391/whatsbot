import { mongooseConnect } from "@/lib/mongoose";
import { init } from "@/services";
import mongoose from "mongoose";
import qrcode from "qrcode-terminal";
import { Client } from "whatsapp-web.js";
import { printWelcomeMessage, theme } from "./terminalUI";

export function connections(client: Client) {
  client.on("qr", (qr: string) => {
    console.clear();
    console.log(theme.background(`${theme.highlight("📲 QR Code Login")}`));
    qrcode.generate(qr, { small: true });
  });

  client.on("loading_screen", async (percent: string) => {
    console.clear();
    const perc = Math.floor(Number(percent));
    const barWidth = 40;
    const filledLength = Math.floor((perc / 100) * barWidth);
    const bar =
      theme.highlight("█".repeat(filledLength)) +
      theme.secondary("░".repeat(barWidth - filledLength));

    console.clear();
    console.log("╭────────────────────────────────────────────╮");
    console.log(`${theme.secondary.bold(" Carregando sistema...")}`);
    console.log(`${bar} ${theme.text(`${perc}%`).padStart(4)}`);
    console.log("╰────────────────────────────────────────────╯");
  });

  client.on("authenticated", async () => {
    console.clear();
    console.log(theme.secondary.bold("Autenticação bem sucessedida!"));
  });

  client.on("auth_failure", (msg: string) => {
    console.clear();
    console.error(
      `${theme.text("❌ Falha na autenticação:")} ${theme.highlight(msg)}`,
    );
  });

  client.on("ready", async () => {
    await mongooseConnect(process.env.MONGO_URL);
    await printWelcomeMessage(
      client.info.pushname,
      client.info.wid.user,
      client.info.platform,
    );
    await init(client);
  });

  client.on("disconnected", async (reason: string) => {
    await mongoose.disconnect();
    console.warn(
      theme.highlight("🔌 Cliente desconectado. Motivo:"),
      theme.secondary(reason),
    );
  });
}
