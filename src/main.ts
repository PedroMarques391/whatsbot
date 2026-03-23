import "module-alias/register";
import { client, connections, eventHandler } from "./bot";
import { safeShutdown } from "./utils";

async function bootstrap(): Promise<void> {
  connections(client);
  eventHandler(client);
  await client.initialize();
}

bootstrap();

process.on("SIGINT", safeShutdown);
process.on("SIGTERM", safeShutdown);
process.on("SIGUSR2", safeShutdown);
