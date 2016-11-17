import { IncomingMessage, ServerResponse } from 'http';
import { Observable } from '@reactivex/rxjs';
import { ReqRes } from './server';
import { Policy } from './policy';
import { FinalRequestObject } from './server';

export class Router {
    routes$: Observable<Route>;
    constructor(routes: Route[]) {
        this.routes$ = Observable.from(routes);
}

    match(reqres: ReqRes): Observable<MatchedRequest> {
        return this.routes$
            .filter((r: Route) => r.path === reqres.req.url)
            //map to a route and reqres object and return it
            .map(r => Object.assign({route: r, reqres: reqres}));
    }
}

export interface Route {
    path: string;
    policies: string[];
    handler: (finalRequestObject: FinalRequestObject) => void;
}

export interface MatchedRequest {
    route: Route;
    reqres: ReqRes
}
