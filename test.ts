import { Observable } from '@reactivex/rxjs';
import { 
    Server,
    IncomingObject,
    FinalRequestObject,
    Route,
    Router,
    RequestHandler,
    PolicyEvaluator,
    ResponseLoader,
    Response,
    RequestExtractor,
    Request,
    RequestResponse,
    MatchedRequest,
    ErrorHandler,
    createServer,
    CorsOptions
 } from './src';
import { routes } from './routes';
import { policies } from './policies';

let cors: CorsOptions = {
    origins: '*',
    requestMethods: '*',
    methods: ['OPTIONS', 'GET'],
    headers: 'origin' // or array of allowed headers e.g: ['authorization', 'content-type'] 
}

createServer(5000, routes, policies, undefined, cors)
//.do(fr => console.log(fr.route))
.subscribe((fr: FinalRequestObject) => {
    RequestHandler.handle(fr); 
});
