import { Observable } from '@reactivex/rxjs';
import { Request, RequestResponse, MatchedRequest } from './request';
import { Response } from './response';
export declare class Router {
    routes$: Observable<Route>;
    constructor(routes: Route[]);
    match(reqres: RequestResponse): Observable<MatchedRequest>;
    parseUrls(route: Route, reqres: RequestResponse): MatchedRequest;
}
export interface Route {
    path: string;
    verb: string;
    policies: string[];
    handler: (req: Request, res: Response) => void;
}
