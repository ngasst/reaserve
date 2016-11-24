/// <reference types="node" />
import { IncomingMessage } from 'http';
import { Route } from './router';
import { Response } from './response';
export declare class RequestExtractor {
    request: Request;
    verb: string;
    constructor(req: Request);
    static extract(req: Request): Request;
    private static getJSON(req);
    private static getParams(req);
}
export interface Request extends IncomingMessage {
    body?: any;
    params?: any;
    unparsedUrl?: string;
}
export interface MatchedRequest {
    route: Route;
    reqres: RequestResponse;
}
export interface RequestResponse {
    req: Request;
    res: Response;
    pass?: boolean;
}
