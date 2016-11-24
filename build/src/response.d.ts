/// <reference types="node" />
import { ServerResponse } from 'http';
export declare class ResponseLoader {
    response: Response;
    constructor(res: ServerResponse);
    load(): Response;
}
export interface Response extends ServerResponse {
    json?: (json: any) => void;
    ok?: (message?: string) => void;
    unauthorized?: (message?: string) => void;
    render?: (path: string, data?: any) => void;
    sendFile?: (path: string, contentType: string, size?: number) => void;
    error?: {
        generic: (status?: number, message?: string) => void;
        server: () => void;
        notFound: () => void;
        policyFailed: () => void;
    };
}
