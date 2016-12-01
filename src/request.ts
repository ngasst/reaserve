import { Observer, Observable } from '@reactivex/rxjs';
import { IncomingMessage, ServerResponse, ClientRequest } from 'http';
import { parse } from 'url';
import { Route } from './router';
import { Response } from './response';


export class RequestExtractor {
    request: Request;
    verb: string;

    constructor(req: Request) {
        this.request = req;
        this.verb = this.request.method;
    }

    static extractBody(rs: RequestResponse): Observable<RequestResponse> {
        return this.getJSON(rs.req)
                .map(data => Object.assign(rs, {req: Object.assign(rs.req, {body: data})}));
    }

    static extract(req: Request) {
        //body
        if (req.method.toUpperCase() === ('POST' || 'UPDATE' || 'DELETE' || 'PATCH')) {
            let request: Request = req;
            request.body = this.getJSON(req);
            return request;
        }

        //params
        if (req.method.toUpperCase() === ('GET' || 'DELETE')) {
            let request: Request = req;
            request.params = this.getParams(req);
            return request;
        }
    }
    private static getJSON(req: Request): Observable<any> {
        return Observable
            .fromEvent(req, 'data')
            .buffer(Observable.fromEvent(req, 'end'))
            .map(d => JSON.parse(d.toString()));
    }

    private static getParams(req: Request) {
        let url: string = req.url;
        let parsed: any = parse(url, true).query;
        return parsed;
    }
}


export interface Request extends IncomingMessage {
    body?: any;
    params?: any;
    unparsedUrl?: string;
}

export interface MatchedRequest {
    route: Route;
    reqres: RequestResponse
}

export interface RequestResponse {
    req: Request;
    res: Response;
    asset?: boolean;
    redirect?: boolean;
    pass?: boolean;
}