import { Server, FinalRequestObject } from './server';
import { Route, Router, MatchedRequest } from './router';
import { routes } from '../routes';
import { policies } from '../policies';
import { RequestHandler } from './request-handler';
import { ReqRes } from './server';
import { PolicyEvaluator, EvaluatedMatchedRequest } from './policy';
import { Response } from './response';

const server: Server = new Server();
const router: Router = new Router(routes);
const evaluator: PolicyEvaluator = new PolicyEvaluator(policies);
const handler: RequestHandler = new RequestHandler();
const parser: RequestParser = new RequestParser();
server.server(3000)
//match the route from the request to the app routes, loaded above [import {routes} from './routes']
.map((r: ReqRes) => router.match(r))
//handle policies for this route here, loaded above [import { policies } from './policies']
.switchMap(r => r)
.map((mr: MatchedRequest) => evaluator.evaluate(mr))
//we now have a route that has been matched and has gone through the policy filter.
.switchMap((er: EvaluatedMatchedRequest) => er)
//Let's attach the custom responses because we are about to start using them
.map((er: EvaluatedMatchedRequest) => {
    let fr: FinalRequestObject = {
        pass: er.pass,
        route: er.route,
        reqres: {
            req: parser.extract(er.reqres.req),
            res: new Response(er.reqres.res)
        }
    };
    return fr;
})
//Now that we have gone through the basic request filtration, let's decide if we handle this request or if we reject it
.do((fr: FinalRequestObject) => {
    if (!fr.pass)
        fr.reqres.res.response.unauthorized();
})
.subscribe((fr: FinalRequestObject) => {
    handler.handle(fr);
});
