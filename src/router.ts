import { IncomingMessage, ServerResponse } from 'http';
import { Observable } from '@reactivex/rxjs';
import { Policy } from './policy';
import { FinalRequestObject, IncomingObject } from './server';
import { Request, RequestResponse, MatchedRequest } from './request';
import { Response } from './response';
import { ErrorHandler } from './handlers/errors-handler';


export class Router {
    routes$: Observable<Route>;
    constructor(routes: Route[]) {
        this.routes$ = Observable.from(routes);
}
    match(reqres: RequestResponse): Observable<Route> {
        return this.routes$
            .filter((r: Route) => {
               let basematch: boolean = false;
               let basepath: string = r.path.match(/[^:]*/i)[0];
               basematch = reqres.req.url.indexOf(basepath) !== -1;
               let postbasereq: string[] = reqres.req.url.replace(basepath, '').split('/').filter(s => s.length > 0);
               let postbasepath: string[] = r.path.replace(basepath, '').split('/').filter(s => s.length > 0);
               return (basematch && postbasereq.length === postbasepath.length); 
            })
            .filter((r: Route) => r.verb.toUpperCase() === reqres.req.method.toUpperCase())
            ;
    }

}

export interface Route {
    path: string;
    matchedPath?: string;
    verb: string;
    policies: string[];
    handler: (req: Request, res: Response) => void;
}

