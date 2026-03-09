import "module-alias/register";
import { client, connections, eventHandler } from "./bot";


function bootstrap() {
    connections(client);
eventHandler(client);
client.initialize();
}

bootstrap();
