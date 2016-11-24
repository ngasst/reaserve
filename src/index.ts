import { Observable } from '@reactivex/rxjs';
import { Server, IncomingObject, FinalRequestObject } from './server';
import { Route, Router } from './router';
import { RequestHandler } from './request-handler';
import { PolicyEvaluator, EvaluatedMatchedRequest, Policy } from './policy';
import { ResponseLoader, Response } from './response';
import { RequestExtractor, Request, RequestResponse, MatchedRequest } from './request';
import { ErrorHandler } from './handlers/errors-handler';
import * as Path from 'path';
import { createReadStream, statSync, Stats, ReadStream } from 'fs-extra';

const mime = require('mime');



export function createServer(
    port: number, routes: Route[],
    policies: Policy[],
    methodsAllowed?: string[],
    allowedOrigins?: string[]|string,
    allowedHeaders?: string[],
    headers?: Header[],
    renderEngine?: (path: string, options?: any, done?: Function) => any,
    assetsFolderName: string = 'assets'
    ): Observable<FinalRequestObject> {
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

        if (r.req.method === 'OPTIONS') {
            r.res.writeHead(200);
            r.res.end();
        }

        if (headers !== null && typeof headers !== 'undefined') {
            headers.forEach((h: Header) => {
                response.setHeader(h.key, h.value);
            });
        }

        //give the response the ability to send back responses
        response.sendFile = (path: string, ct: string, size?: number): void => {
            let rs: ReadStream = createReadStream(path);
                r.res.setHeader('Content-Type', ct);
                if (size !== null && typeof size !== 'undefined')
                    r.res.setHeader('Content-Length', `${size}`);
                r.res.writeHead(200);
                rs.pipe(r.res);
        }

        //check if a render engine was provided; if so, use it; otherwise, use default render method;
        if (renderEngine !== null && typeof renderEngine !== 'undefined') {
            response.render = (path: string, options: any): void => {
                renderEngine(path, options, (err, data) => {
                    if (err){
                        response.writeHead(500, {'Content-Type': 'text/html'});
                        response.end(data);
                    } else {
                        response.writeHead(200, {'Content-Type': 'text/html'});
                        response.end(data);
                    }
                });
            }
        } else {
            response.render = (html: string): void => {
                response.writeHead(200, {'Content-Type': 'text/html'});
                response.end(html);
            }
        }
        return {req: r.req, res: response};
    })
    .map((r: RequestResponse) => {
        let regex = `^\/${assetsFolderName}\/?[^\s]+`;
        let match = r.req.url.match(regex);
        let testAssets: boolean = match !== null;
        if(testAssets) {
            let type: string = mime.lookup(r.req.url);
            let path: string = Path.join(process.cwd(), r.req.url);
            let stats: Stats = statSync(path);
            r.res.sendFile(path, type, stats.size);
            return {req: r.req, res: r.res, pass: false}
        } else {
            return r;
        }
    })
    // for some reason, rxjs throws an error when trying to access the requent event data after it has been matched.
    // check here if this is a request type that has post data and if so, extract it before matching.
    .map((r: RequestResponse) => {
        let rr: RequestResponse = {
            req : (r.req.method.toUpperCase() !== ('GET'||'DELETE')) ? RequestExtractor.extract(r.req) : r.req,
            res: r.res,
            pass: r.pass
        }
        return rr;
    })
    .do(r => console.log(r.req.url))
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
        let obj: MatchedRequest = {route: mr.route, reqres: {req: request, res: response, pass: mr.reqres.pass}};
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
            exec: er.reqres.pass,
            req: er.reqres.req,
            res: er.reqres.res,
            route: er.route
        }
        return emr;
    })
    //Now that we have gone through the basic request filtration, let's decide if we handle this request or if we reject it
    //if it passes, carry on, otherwise, send an policy error back
    .map((fr: FinalRequestObject) => {
        console.log(fr.exec, fr.pass);
        if (!fr.pass && (fr.exec || typeof fr.exec === 'undefined')) {
            ErrorHandler.policyError(fr.req, fr.res);
            return fr;
        } else {
            return fr;
        }
    });
}

export { Server, FinalRequestObject, IncomingObject } from './server';
//export { exportPolicies } from './exporters/export-policies';
//export { exportRoutes } from './exporters/export-routes';
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