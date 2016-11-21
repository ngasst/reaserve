import { Observer, Observable } from '@reactivex/rxjs';
import { IncomingMessage } from 'http';
import { parse } from 'url';

export class RequestExtractor {
    request: Request;
    verb: string;

    constructor(req: IncomingMessage) {
        this.request = req;
        this.verb = this.request.method;
    }

    extract() {
        //params
        if (this.verb.toUpperCase() === ('GET' || 'DELETE')) {
            this.request.params = this.getParams(this.request);
            return this.request;
        }

        
        //body
        if (this.verb.toUpperCase() === ('POST' || 'UPDATE' || 'DELETE' || 'PATCH')) {
            this.request.body = this.getJSON(this.request);
            return this.request;
        }

    }

    private getJSON(req: IncomingMessage): Observable<any> {
        return Observable
        	.fromEvent(req, 'data')
            .buffer(Observable.fromEvent(req, 'end'))
            .map(d => JSON.parse(d.toString()));
    }

    private getParams(req: Request) {
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