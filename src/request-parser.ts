import { Observer, Observable } from '@reactivex/rxjs';
import { IncomingMessage, RequestOptions, request } from 'http';
import { RequestOptions as SecureRequestOptions, request as secureRequest } from 'https';
import { FinalRequestObject } from './server';

export class RequestExtractor {
    request: Request;
    protocol: string;
    verb: string;

    constructor(final: FinalRequestObject) {
        this.request = final;
        this.protocol = this.request.connection.encrypted ? 'https' : 'http';
        this.verb = this.request.method;
    }

    extract() {
        //params
        if (this.verb.toUpperCase() === ('GET' || 'DELETE'))
            return this.getParams();
        
        //body
        if (this.verb.toUpperCase() === ('POST' || 'UPDATE' || 'DELETE' || 'PATCH'))
            return this.getJSON();


    }

    private getJSON(options: RequestOptions) {
        return Observable.create((observer) => {
            let req = this.protocol === 'http' ? this.getRequest(options, observer) : this.getSecureRequest(options, observer);
        });
    }

    private getRequest(options: RequestOptions, observer: Observer<any>) {
        let req = request(options, (res: IncomingMessage) => {
            let rawData: string = '';
            res.on('data', (chunk: string) => rawData += chunk);
            res.on('end', () => {
                let data: any;
                try {
                    data = JSON.parse(rawData);
                } catch (error) {
                    observer.error(error);
                }

                observer.next(data);
                observer.complete();
            });
        });

        req.on('error', (err) => observer.error(err));
        req.end();
    }

    private getSecureRequest(options: RequestOptions, observer: Observer<any>) {
        let req = secureRequest(options, (res: IncomingMessage) => {
            let rawData: string = '';
            res.on('data', (chunk: string) => rawData += chunk);
            res.on('end', () => {
                let data: any;
                try {
                    data = JSON.parse(rawData);
                } catch (error) {
                    observer.error(error);
                }

                observer.next(data);
                observer.complete();
            });
        });
    }

    private getParams() {
        
    }
}

export interface Request extends IncomingMessage {
    body?: any;
    params?: any;
}