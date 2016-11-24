import { Route } from './router';
import { Response } from './response';
import { Request } from './request';
export declare class Server {
    private protocol;
    constructor(protocol?: string);
    server(port: number, protocol?: string): any;
    private getHttpServer(observer);
    private getHttpsServer(observer);
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
