import { Server, ReqRes, IncomingObject, FinalRequestObject } from './server';
import { Route, Router, MatchedRequest } from './router';
import { routes } from '../routes';
import { policies } from '../policies';
import { RequestHandler } from './request-handler';
import { PolicyEvaluator, EvaluatedMatchedRequest } from './policy';
import { ResponseLoader, Response } from './response';
import { RequestExtractor, Request } from './request';

const server: Server = new Server();
const router: Router = new Router(routes);
const evaluator: PolicyEvaluator = new PolicyEvaluator(policies);
const handler: RequestHandler = new RequestHandler();
server.server(3000)
//match the route from the request to the app routes, loaded above [import {routes} from './routes']
.map((r: IncomingObject) => router.match(r))
.map((r: IncomingObject) => {
    let reqex = new RequestExtractor(r.req);
    let resload = new ResponseLoader(r.res);
    let response: Response = resload.load();
    let request: Request = reqex.extract();
    let obj: IncomingObject = {req: request, res: response};
    return obj;
})
/*.map((r: IncomingObject) => {
    let req: Request = new RequestExtractor(r.req).extract();
	return {req: req, res: r.res}
})*/
//handle policies for this route here, loaded above [import { policies } from './policies']
.switchMap(r => r)
.map((mr: MatchedRequest) => evaluator.evaluate(mr))
//we now have a route that has been matched and has gone through the policy filter.
.switchMap((er: EvaluatedMatchedRequest) => er)
//Now that we have gone through the basic request filtration, let's decide if we handle this request or if we reject it
.do((fr: FinalRequestObject) => {
    if (!fr.pass)
    fr.reqres.res.unauthorized();
})
.subscribe((fr: FinalRequestObject) => {
    let req: Request = fr.reqres.req;
    let res: Response = fr.reqres.res;
    let func: ((req: Request, res: Response) => void) = fr.route.handler
    handler.handle(func, req, res);
});
