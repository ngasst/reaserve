import { Observable } from '@reactivex/rxjs';
import { Server, IncomingObject, FinalRequestObject } from './server';
import { Route } from './router';
import { RequestHandler } from './request-handler';
import { PolicyEvaluator, EvaluatedMatchedRequest, Policy } from './policy';
import { ResponseLoader, Response } from './response';
import { RequestExtractor, Request, RequestResponse, MatchedRequest } from './request';
import { ErrorHandler } from './handlers/errors-handler';
import { manageHeaders, manageAssets, manageRouting } from './server-partials';
import { AssetHandler } from './asset-handler';
import { manageRequestRouteRemapping } from './server-partials';



export function createServer(
    port: number, routes: Route[],
    policies: Policy[],
    rerouteUnmatched: boolean = false,
    cors: CorsOptions = undefined,
    renderEngine: ((path: string, options?: any, done?: Function) => any) | string = 'default',
    assetsFolderName: string = 'assets'
    ): Observable<FinalRequestObject> {
    const server: Server = new Server();
    const evaluator: PolicyEvaluator = new PolicyEvaluator(policies);
    
    return server.server(port)
    .map((r: RequestResponse) => {
        return manageHeaders(r, renderEngine, cors);
    })
    .map((r: RequestResponse) => {
        return manageAssets(r);
    })
    /*.map((r: RequestResponse) => {
        // for some reason, rxjs throws an error when trying to access the requent event data after it has been matched.
        // check here if this is a request type that has post data and if so, extract it before matching.
        //return Object.assign(r, {req: (r.req.method.toUpperCase() !== ('GET'||'DELETE')) ? RequestExtractor.extract(r.req) : r.req});
    })*/
    .map((r: RequestResponse) => {
        if (['GET', 'DELETE'].indexOf(r.req.method.toUpperCase()) !== -1)
            return Observable.of(r);
       return RequestExtractor.extractBody(r);
    })
    //.do(r => console.log(r.req.url))
    .switch()
    //match the route from the request to the app routes, loaded above [import {routes} from './routes']
    .map((r: RequestResponse) => manageRouting(routes, r, rerouteUnmatched))
    //unwrap observables to a first dergree
    .switch()
    .map((mr: MatchedRequest) => manageRequestRouteRemapping(mr))
    //build the right type of request/response object that has custom methods on response
    //load url parameters as parsed data here
    .map((mr: MatchedRequest) => {
        let resload = new ResponseLoader(mr.reqres.res);
        let response: Response = resload.load();
        let request: Request = (mr.reqres.req.method.toUpperCase() === ('GET'||'DELETE')) ? RequestExtractor.extract(mr.reqres.req) : mr.reqres.req;
        let obj: MatchedRequest = {route: mr.route, reqres: {req: request, res: response, asset: mr.reqres.asset, redirect: mr.reqres.redirect}};
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
            asset: er.reqres.asset,
            redirect: er.reqres.redirect,
            req: er.reqres.req,
            res: er.reqres.res,
            route: er.route
        }
        return emr;
    })
    //Now that we have gone through the basic request filtration, let's decide if we handle this request or if we reject it
    //if it passes, carry on, otherwise, send an policy error back
    .map((fr: FinalRequestObject) => {
        //console.log('exec from index: ', 'redirect: ', fr.redirect, 'asset: ', fr.asset, 'policy :', fr.pass);
        if (fr.asset) {
            AssetHandler.serve(fr.req, fr.res, assetsFolderName);
            return fr;
        }

        if (!fr.pass) {
            ErrorHandler.policyError(fr.req, fr.res);
            return fr;
        }
        return fr;
    });
}

export { Server, FinalRequestObject, IncomingObject } from './server';
export { AssetHandler } from './asset-handler';
export { ErrorHandler } from './handlers/errors-handler';
export { Request, RequestExtractor, RequestResponse, MatchedRequest } from './request';
export { Response, ResponseLoader } from './response';
export { RequestHandler } from './request-handler';
export { Route, Router } from './router';
export { Policy, PolicyEvaluator } from './policy';
export interface Header {
    key: string;
    value: string | string[];
}
export interface CorsOptions {
    origins: string | string[];
    requestMethods: string | string[];
    methods: string[];
    headers: string | string[];
}