import { Route } from '../src/router';
import { ReqRes } from '../src/server';
import { HomeHandler } from '../handlers/home';

export const routes: Route[] = [
    {
        path: '/',
        handler: HomeHandler.main,
        policies: ['main']
    }
]