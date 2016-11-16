import { Route } from '../src/router';
import { IncomingMessage, ServerResponse } from 'http';

export const routes: Route[] = [
    {
        handler: (req: IncomingMessage, res: ServerResponse) => {},
        path: '/'
    }
]