import { Client, LocalAuth } from "whatsapp-web.js";
import { CHROME_PATH } from "../config/env";

export const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        executablePath: CHROME_PATH,
    },
});