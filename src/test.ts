import { Server } from './server';
import { Observable } from '@reactivex/rxjs';
import { Route, Router } from './router';
import { IncomingMessage, ServerResponse } from 'http';
import * as Path from 'path';
import { main } from '../routes';

const server: Server = new Server();
const router: Router = new Router('routes');
server.server(3000)
.map((r: {req: IncomingMessage, res: ServerResponse}) => router.match(r.req))
.subscribe((req) => {
    console.log(req);
});
