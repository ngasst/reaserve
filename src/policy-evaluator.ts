import { Observable, Subscription } from 'rxjs';

export function policyEvaluator(route) {
    return Observable.from(route.policies)
    .concatMap(pol => pol.try(route.req))
    .reduce((acc, val) => {let num = val ? 0 : 1; return acc+num}, 0)
    .map(guard => guard === 0 ? true : false);
}