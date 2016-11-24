import { Observable } from '@reactivex/rxjs';
import { FinalRequestObject } from './server';
import { Route } from './router';
import { Policy } from './policy';
export declare function createServer(port: number, routes: Route[], policies: Policy[], methodsAllowed?: string[], allowedOrigins?: string[] | string, allowedHeaders?: string[], headers?: Header[], renderEngine?: (path: string, options?: any) => any, assetsFolderName?: string): Observable<FinalRequestObject>;
export { Server, FinalRequestObject, IncomingObject } from './server';
export { exportPolicies, exportRoutes } from './exporters';
export { ErrorHandler } from './handlers';
export { Request, RequestExtractor, RequestResponse, MatchedRequest } from './request';
export { Response, ResponseLoader } from './response';
export { RequestHandler } from './request-handler';
export { Route, Router } from './router';
export { Policy, PolicyEvaluator } from './policy';
export interface Header {
    key: string;
    value: string | string[];
}
