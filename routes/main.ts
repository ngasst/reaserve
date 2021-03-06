import { Route } from '../src/router';
import { RequestResponse } from '../src/request';
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
    },
    {
        path: '/api/search',
        verb: 'POST',
        handler: HomeHandler.post,
        policies: ['main']
    },
    {
        path: '/:id',
        verb: 'GET',
        handler: HomeHandler.getById,
        policies: []
    },
    {
        path: '/:id/:username',
        verb: 'GET',
        handler: HomeHandler.getByIdAndUsername,
        policies: []
    }
    ,
    {
        path: '/bobo/:id/:username',
        verb: 'GET',
        handler: HomeHandler.getByIdAndUsername,
        policies: []
    }
]