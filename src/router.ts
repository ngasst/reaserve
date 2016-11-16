import { IncomingMessage, ServerResponse } from 'http';
import { Observable } from '@reactivex/rxjs';
import { readdir, readFile } from 'fs-extra';
import * as Path from 'path';
import * as webpack from 'webpack';
const wpnu = require('webpack-node-utils');

export class Router {
    routes$: Observable<Route>;
    constructor(routes: Route[]) {
        this.routes$ = Observable.from(routes);
}

    match(req: IncomingMessage): Observable<Route> {
        return this.routes$.filter((r: Route) => r.path === req.url);
    }
}

export interface Route {
    path: string;
    handler: (req: IncomingMessage, res: ServerResponse) => void;
}