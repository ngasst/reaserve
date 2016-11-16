import { Observable, Observer } from '@reactivex/rxjs';
import { createServer, ServerRequest, ServerResponse, Server as HttpServer, IncomingMessage, request, RequestOptions } from 'http';
import { createServer as createSSLServer, Server as HttpsServer, request as secureRequest } from 'https';

export class Server {
    constructor(private protocol: string = 'http') {
        //
    }

    server(port: number, protocol: string = this.protocol) {
        return Observable.create((observer: Observer<{req: IncomingMessage, res: ServerResponse}>) => {
            let server = protocol === 'http' ? this.getHttpServer(observer) : this.getHttpsServer(observer);

            server.listen(port);

            return () => {
                observer.complete();
                server.close();
            }
        });
    }

    getJSON(options: RequestOptions) {
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

    private getHttpServer(observer: Observer<{req: IncomingMessage, res: ServerResponse}>): HttpServer {
        let server: HttpServer = createServer((req: IncomingMessage, res: ServerResponse) => {
            observer.next({req: req, res: res});
        });
        
        return server;
    }

    private getHttpsServer(observer: Observer<{req: IncomingMessage, res: ServerResponse}>): HttpsServer {
        let server: HttpsServer = createSSLServer((req: IncomingMessage, res: ServerResponse) => {
            observer.next({req: req, res: res});
        });
        return server;
    }
}