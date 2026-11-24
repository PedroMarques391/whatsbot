import "module-alias/register";
import { client, connections, eventHandler } from "./bot";
import { ShutdownUtils } from "./utils";

async function bootstrap(): Promise<void> {
  connections(client);
  eventHandler(client);
  await client.initialize();
}

bootstrap();

process.on("SIGINT", ShutdownUtils.safeShutdown);
process.on("SIGTERM", ShutdownUtils.safeShutdown);
process.on("SIGUSR2", ShutdownUtils.safeShutdown);
