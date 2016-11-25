import { Observable } from '@reactivex/rxjs';
import { Router, Route, RequestResponse, MatchedRequest, ErrorHandler } from '../index';

export function manageRouting(routes: Route[], r: RequestResponse, redirect: boolean): Observable<MatchedRequest> {
    const router: Router = new Router(routes);
    let matched$: Observable<MatchedRequest> = router.match(r);
    return matched$.isEmpty().map(t => {
        if (t) {
            if (redirect && !r.asset) {
                let mr: MatchedRequest = Object.assign({}, {reqres: Object.assign(r, {redirect: redirect}), route: {path: r.req.url, verb: r.req.method, policies: [], handler: null}});
                return Observable.of(mr);
            } else {
                let mr: MatchedRequest =  Object.assign({}, {reqres: r, route: {path: '/route-not-found', verb: 'GET', policies: [], handler: ErrorHandler.routeNotFound}});
                return Observable.of(mr);
            }
        } else {
            return matched$;
        }
    })
    .switch();
    
    
}