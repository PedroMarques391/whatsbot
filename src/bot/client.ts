import { Client, LocalAuth } from "whatsapp-web.js";

export const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    executablePath: "/usr/bin/google-chrome-stable",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--headless=new",
    ],
  },
});
