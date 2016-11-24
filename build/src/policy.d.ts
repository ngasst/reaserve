import { Observable } from '@reactivex/rxjs';
import { Route } from './router';
import { MatchedRequest, RequestResponse } from './request';
export declare class PolicyEvaluator {
    policies$: Observable<Policy>;
    constructor(policies: Policy[]);
    evaluate(mr: MatchedRequest): Observable<EvaluatedMatchedRequest>;
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
