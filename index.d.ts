import { Server, FinalRequestObject, IncomingObject } from './src/server';
import { exportPolicies, exportRoutes } from './src/exporters';
import { ErrorHandler } from './src/handlers';
import { Request, RequestExtractor, RequestResponse, MatchedRequest } from './src/request';
import { Response, ResponseLoader } from './src/response';
import { RequestHandler } from './src/request-handler';
import { Route, Router } from './src/router';
import { Policy, PolicyEvaluator } from './src/policy';
import { Header, createServer } from './index';

declare module "reaserve" {
    export {
        Server,
        FinalRequestObject,
        IncomingObject,
        ErrorHandler,
        Request,
        RequestExtractor,
        RequestResponse,
        MatchedRequest,
        Response,
        ResponseLoader,
        RequestHandler,
        Route,
        Router,
        Policy,
        PolicyEvaluator,
        Header,
        createServer
    }
}