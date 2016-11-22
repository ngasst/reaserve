import { Observable } from '@reactivex/rxjs';
import { Server, IncomingObject, FinalRequestObject } from './src/server';
import { Route, Router } from './src/router';
import { RequestHandler } from './src/request-handler';
import { PolicyEvaluator, EvaluatedMatchedRequest, Policy } from './src/policy';
import { ResponseLoader, Response } from './src/response';
import { RequestExtractor, Request, RequestResponse, MatchedRequest } from './src/request';
import { ErrorHandler } from './src/handlers/errors-handler';



export function createServer(port: number, routes: Route[], policies: Policy[], methodsAllowed?: string[], allowedOrigins?: string[]|string, allowedHeaders?: string[]): Observable<FinalRequestObject> {
    const server: Server = new Server();
    const router: Router = new Router(routes);
    const evaluator: PolicyEvaluator = new PolicyEvaluator(policies);
    
    return server.server(port)
    .map((r: RequestResponse) => {
        let response: Response = r.res;
        if ((allowedOrigins !== null && typeof allowedOrigins !== 'undefined' && typeof allowedOrigins === 'array')) {
            response.setHeader('Access-Control-Allow-Origin', allowedOrigins.join(','));
        } else {
            if (allowedOrigins !== null && typeof allowedOrigins !== 'undefined' && typeof allowedOrigins === 'string') {
                response.setHeader('Access-Control-Allow-Origin', allowedOrigins);
            }
        }

        if ((methodsAllowed !== null && typeof methodsAllowed !== 'undefined'))
            response.setHeader('Access-Control-Allow-Methods', methodsAllowed.join(','));
        
        if ((allowedHeaders !== null && typeof allowedHeaders !== 'undefined'))
            response.setHeader('Access-Control-Allow-Headers', allowedHeaders.join(','));
        console.log(response.getHeader('Access-Control-Allow-Origin'));
        return {req: r.req, res: response};
    })
    // for some reason, rxjs throws an error when trying to access the requent event data after it has been matched.
    // check here if this is a request type that has post data and if so, extract it before matching.
    .map((r: RequestResponse) => {
        let rr: RequestResponse = {
            req : (r.req.method.toUpperCase() !== ('GET'||'DELETE')) ? RequestExtractor.extract(r.req) : r.req,
            res: r.res
        }
        return rr;
    })
    //match the route from the request to the app routes, loaded above [import {routes} from './routes']
    .map((r: RequestResponse) => router.match(r))
    //unwrap observables to a first dergree
    .switch()
    //build the right type of request/response object that has custom methods on response
    //load url parameters as parsed data here
    .map((mr: MatchedRequest) => {
        let resload = new ResponseLoader(mr.reqres.res);
        let response: Response = resload.load();
        let request: Request = (mr.reqres.req.method.toUpperCase() === ('GET'||'DELETE')) ? RequestExtractor.extract(mr.reqres.req) : mr.reqres.req;
        let obj: MatchedRequest = {route: mr.route, reqres: {req: request, res: response}};
        return obj;
    })
    //handle policies for this route here, loaded above [import { policies } from './policies']
    .map((mr: MatchedRequest) => evaluator.evaluate(mr))
    //we now have a route that has been matched and has gone through the policy filter.
    //flatten observables to first degree
    .switch()
    //build the final object to be passed onto the application.
    .map((er: EvaluatedMatchedRequest) => {
        let emr: FinalRequestObject = {
            pass: er.pass,
            req: er.reqres.req,
            res: er.reqres.res,
            route: er.route
        }
        return emr;
    })
    //Now that we have gone through the basic request filtration, let's decide if we handle this request or if we reject it
    //if it passes, carry on, otherwise, send an policy error back
    .do((fr: FinalRequestObject) => {
        if (!fr.pass)
        ErrorHandler.policyError(fr.req, fr.res);
    });
}

export { Server, FinalRequestObject, IncomingObject } from './src/Server';
export { exportPolicies, exportRoutes } from './src/exporters';
export { ErrorHandler } from './src/handlers';
export { Request, RequestExtractor, RequestResponse, MatchedRequest } from './src/request';
export { Response, ResponseLoader } from './src/response';
export { RequestHandler } from './src/request-handler';
export { Route, Router } from './src/router';
export { Policy, PolicyEvaluator } from './src/policy';