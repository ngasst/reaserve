import { Observable, Observer } from '@reactivex/rxjs';
import { createServer, ServerRequest, ServerResponse, Server as HttpServer, IncomingMessage, request, RequestOptions } from 'http';
import { createServer as createSSLServer, Server as HttpsServer, request as secureRequest } from 'https';
import { Route } from './router';
import { Response } from './response';
import { Request, RequestResponse } from './request';

export class Server {
    constructor(private protocol: string = 'http') {
        //
    }

    server(port: number, protocol: string = this.protocol) {
        return Observable.create((observer: Observer<{req: Request, res: ServerResponse}>) => {
            let server = protocol === 'http' ? this.getHttpServer(observer) : this.getHttpsServer(observer);

            server.listen(port);

            return () => {
                observer.complete();
                server.close();
            }
        });
    }

    private getHttpServer(observer: Observer<{req: Request, res: ServerResponse}>): HttpServer {
        let server: HttpServer = createServer((req: Request, res: ServerResponse) => {
            observer.next({req: req, res: res});
        });
        
        return server;
    }

    private getHttpsServer(observer: Observer<{req: Request, res: ServerResponse}>): HttpsServer {
        let server: HttpsServer = createSSLServer((req: Request, res: ServerResponse) => {
            observer.next({req: req, res: res});
        });
        return server;
    }
}

export interface FinalRequestObject {
    route: Route;
    req: Request;
    res: Response;
    pass: boolean;
    exec?: boolean;

}

export interface IncomingObject {
    req: Request;
    res: Response;
}