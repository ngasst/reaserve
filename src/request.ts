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
        return Observable.create((observer) => {
            let rawData: string = '';
            req.on('data', (chunk: string) => rawData += chunk);
            req.on('end', () => {
                let data: any;
                try {
                    data = JSON.parse(rawData);
                } catch (error) {
                    observer.error(error);
                }
                observer.next(data);
                observer.complete();
            });

            req.on('error', (err) => observer.error(err));
        });
    }

    private getParams(req: IncomingMessage) {
        let url: string = req.url;
        let parsed: any = parse(url, true).query;
        return parsed;
    }
}

export interface Request extends IncomingMessage {
    body?: any;
    params?: any;
}