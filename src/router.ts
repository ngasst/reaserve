import { IncomingMessage, ServerResponse } from 'http';
import { Observable } from '@reactivex/rxjs';
import { Policy } from './policy';
import { FinalRequestObject, IncomingObject } from './server';
import { Request, RequestResponse, MatchedRequest } from 'request';
import { Response } from 'response';
import { ErrorHandler } from './handlers/errors-handler';

export class Router {
    routes$: Observable<Route>;
    constructor(routes: Route[]) {
        this.routes$ = Observable.from(routes);
}
    match(reqres: RequestResponse): Observable<MatchedRequest> {
        return this.routes$
            .map(r => this.parseUrls(r, reqres))
            .filter((mr: MatchedRequest) => {
                let test: boolean = 
                (
                    typeof mr.reqres.req !== 'undefined'
                    && mr.route.path === mr.reqres.req.unparsedUrl
                    && mr.route.verb.toUpperCase() === mr.reqres.req.method.toUpperCase()
                );
                return test;
            })
            .defaultIfEmpty(Object.assign({}, {reqres: reqres, route: {path: '/route-not-found', verb: 'GET', policies: [], handler: ErrorHandler.routeNotFound}}))
            //.do(r => console.log(r.route.path, r.reqres.req.url, r.reqres.req.unparsedUrl))
            //.do(r => console.log(r));
    }

    parseUrls(route: Route, reqres: RequestResponse): MatchedRequest {
        let path: string = route.path;
        let url: string = reqres.req.url;
        let labels: string[] = path.match(/(:[^\/|\s]+)/g);
        let base: string = path.match(/(^\/[a-zA-Z-_\/]*)/g)[0];
        labels = labels === null ? [] : labels;
        let valuesArray: string[] = url.replace(base, '').split('/');
        let values = valuesArray.filter(s => s.length > 1);
        let newPath: string = base.length > 1 ? base.concat('/').concat(values.join('/')) : base.concat(values.join('/'));
        
        let mr: MatchedRequest;
                
        if ((labels.length > 0 && labels.length === values.length)) {
            //console.log(labels);
            let pairs: string[] = labels.map((l, i) => `${l}=${values[i]}`).map(s => s.slice(1, s.length));
	        let newUrl: string = base.concat('?').concat(pairs.join('&'));
	        let newRoute: Route = {
                handler: route.handler,
                policies: route.policies,
                verb: route.verb,
                path: newPath
            }
            let newReq: Request = Object.assign(reqres.req, {url: newUrl, unparsedUrl: url});
            mr = {
                route: newRoute,
                reqres: Object.assign(reqres, {req: newReq})
            }
        } else {
            mr = {
                route: route,
                reqres: {
                    req: Object.assign({}, reqres.req, {unparsedUrl: url}),
                    res: reqres.res
                }
            }
        }
        //console.log(mr.route.path, labels, reqres.req.url, reqres.req.parsedUrl);
        return mr;
    }
}

export interface Route {
    path: string;
    verb: string;
    policies: string[];
    handler: (req: Request, res: Response) => void;
}

