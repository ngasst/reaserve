import { Route } from '../src/router';
import { ReqRes } from '../src/server';
import { HomeHandler } from '../handlers/home';

export const routes: Route[] = [
    {
        path: '/',
        verb: 'GET',
        handler: HomeHandler.main,
        policies: ['main']
    },
    {
        path: '/',
        verb: 'POST',
        handler: HomeHandler.post,
        policies: ['main']
    }
]