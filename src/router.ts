import { IncomingMessage, ServerResponse } from 'http';
import { Observable } from '@reactivex/rxjs';
import { ReqRes } from './server';
import { Policy } from './policy';
import { FinalRequestObject } from './server';
import { Request } from 'request';
import { Response } from 'response';
import { ErrorHandler } from './handlers/errors-handler';

export class Router {
    routes$: Observable<Route>;
    constructor(routes: Route[]) {
        this.routes$ = Observable.from(routes);
}

    match(reqres: ReqRes): Observable<MatchedRequest> {
        return this.routes$
            .merge(Observable.of({path: '/route-not-found', verb: 'GET', policies: [], handler: ErrorHandler.routeNotFound}))
            .map(r => this.parseUrls(r, reqres))
            .filter((mr: MatchedRequest) => {
                let test: boolean = 
                (
                    mr.reqres.req !== undefined
                    && mr.route.path === mr.reqres.req.url
                    && mr.route.verb.toUpperCase() === mr.reqres.req.method.toUpperCase()
                )
                ||
                (
                    !mr.reqres.req
                    && mr.route.path === '/route-not-found'
                );
                return test;
            })
            //.do(r => console.log(r));
    }

    parseUrls(route: Route, reqres: ReqRes): MatchedRequest {
        let path: string = route.path;
        let url: string = reqres.req.url;
        let newPath: string;
        let newUrl: string;
        let newRoute: Route;
        let mr: MatchedRequest;
        
        let labels: string[] = path.match(/(:[^\/|\s]+)/g);
        let base: string = path.match(/(^\/[a-zA-Z-_\/]*)/g)[0];
        console.log(labels);
        if ((labels !== undefined && labels !== null && labels.length > 0)) {
            let values: string[] = url.replace(base, '').split('/');
            let pairs: string[] = labels.map((l, i) => `${l}=${values[i]}`);
            newUrl = base.concat('/?').concat(pairs.join('&'));
            let newPath = url;
            newRoute = {
                handler: route.handler,
                policies: route.policies,
                verb: route.verb,
                path: newPath
            }
            let newReq: IncomingMessage = Object.assign({}, reqres.req, {url: newUrl});
            mr = {
                route: newRoute,
                reqres: Object.assign({}, reqres, {req: newReq})
            }
        } else {
            mr = {
                route: route,
                reqres: reqres
            }
        }
        
        return mr;
    }
}

export interface Route {
    path: string;
    verb: string;
    policies: string[];
    handler: (req: Request, res: Response) => void;
}

export interface MatchedRequest {
    route: Route;
    reqres: ReqRes
}

