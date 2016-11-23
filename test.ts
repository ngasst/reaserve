import { Observable } from '@reactivex/rxjs';
import { Server, IncomingObject, FinalRequestObject } from './src/server';
import { Route, Router } from './src/router';
import { routes } from './routes';
import { policies } from './policies';
import { RequestHandler } from './src/request-handler';
import { PolicyEvaluator, EvaluatedMatchedRequest } from './src/policy';
import { ResponseLoader, Response } from './src/response';
import { RequestExtractor, Request, RequestResponse, MatchedRequest } from './src/request';
import { ErrorHandler } from './src/handlers/errors-handler';
import { createServer } from './index';

createServer(3000, routes, policies, null, '10.*')
.subscribe((fr: FinalRequestObject) => {
    RequestHandler.handle(fr);
});
