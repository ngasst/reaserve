import { Observable } from '@reactivex/rxjs';
import { FinalRequestObject } from './src/server';
import { Route } from './src/router';
import { Policy } from './src/policy';
export declare function createServer(port: number, routes: Route[], policies: Policy[], methodsAllowed?: string[], allowedOrigins?: string[] | string, allowedHeaders?: string[], headers?: Header[], renderEngine?: (path: string, options?: any) => any, assetsFolderName?: string): Observable<FinalRequestObject>;
export { Server, FinalRequestObject, IncomingObject } from './src/server';
export { exportPolicies, exportRoutes } from './src/exporters';
export { ErrorHandler } from './src/handlers';
export { Request, RequestExtractor, RequestResponse, MatchedRequest } from './src/request';
export { Response, ResponseLoader } from './src/response';
export { RequestHandler } from './src/request-handler';
export { Route, Router } from './src/router';
export { Policy, PolicyEvaluator } from './src/policy';
export interface Header {
    key: string;
    value: string | string[];
}
