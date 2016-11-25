import { Observable } from '@reactivex/rxjs';
import { Route } from './router';
import { MatchedRequest, RequestResponse } from './request';

export class PolicyEvaluator {
    policies$: Observable<Policy>;
    constructor(policies: Policy[]) {
        this.policies$ = Observable.from(policies);
    }

    evaluate(mr: MatchedRequest): Observable<EvaluatedMatchedRequest> {
        return this.policies$
        .filter((pol: Policy) => mr.route.policies.indexOf(pol.name) !== -1 || mr.route.policies.length === 0)
        .map(p => p.method(mr.reqres))
        .do(val => console.log('from policy evaluator: ', val))
        .reduce((acc, val) => {let num = val ? 0 : 1; return acc + num }, 0)
        .map(guard => guard === 0 ? Object.assign({route: mr.route, reqres: mr.reqres, pass: true}) : Object.assign({route: mr.route, reqres: mr.reqres, pass: false}));
    }
}

export interface Policy {
    name: string;
    method: (reqres: RequestResponse) => boolean;
}

export interface EvaluatedMatchedRequest {
    route: Route;
    reqres: RequestResponse;
    pass: boolean;
}