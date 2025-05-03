import 'module-alias/register';
import { client, connections, eventHandler } from './bot';

connections(client);
eventHandler(client);
client.initialize();
