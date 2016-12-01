import { Observable } from '@reactivex/rxjs';
import { Router, Route, RequestResponse, MatchedRequest, ErrorHandler } from '../index';

export function manageRouting(routes: Route[], r: RequestResponse, redirect: boolean): Observable<MatchedRequest> {
    const matched$: Observable<Route> =  new Router(routes).match(r);
    return matched$
        .defaultIfEmpty(false)
        .map((t: boolean) => {
            if (!t) {
                if (redirect) {
                    return Observable.of(Object.assign({}, {reqres: Object.assign(r, {redirect: redirect}), route: {path: '/redirected', verb: r.req.method, policies: [], handler: null}}));
                }
                return Observable.of(Object.assign({}, {reqres: r, route: {path: '/route-not-found', verb: 'GET', policies: [], handler: ErrorHandler.routeNotFound}}));
            }
            return matched$.map(route => Object.assign({}, {route: route, reqres: r}));
        }) 
        .switch();
    
}