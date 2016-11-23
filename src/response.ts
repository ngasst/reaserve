import { ServerResponse } from 'http';
import { readFile } from 'fs-extra';

export class ResponseLoader {
    response: Response;

    constructor(res: ServerResponse) {
        this.response = res;
        this.response.json = (json: any) => {
            this.response.writeHead(200, {'Content-Type': 'application/json'});
            this.response.end(JSON.stringify(json));
        }

        this.response.ok = (message: string = 'Success') => {
            this.response.writeHead(200, {'Content-Type': 'application/json'});
            this.response.end(JSON.stringify({success: true, message}));
        }

        this.response.unauthorized = (message: string = 'You are not authorized to access this resource.') => {
            this.response.writeHead(401, {'Content-Type': 'application/json'});
            this.response.end(JSON.stringify({success: false, message}));
        }

        this.response.error = {
            generic: (status: number = 404, message: string = 'Resource not found'):void => {
                this.response.writeHead(status, {'Content-Type': 'application/json'});
                this.response.end(JSON.stringify({success: false, message: message}));
            },
            server: () => {
                this.response.writeHead(500, {'Content-Type': 'application/json'});
                this.response.end(JSON.stringify({success: false, message: 'Something went wrong on the server. Please try again later.'}));
            },
            notFound: () => {
                this.response.writeHead(404, {'Content-Type': 'application/json'});
                this.response.end(JSON.stringify({success: false, message: 'Resource Not Found'}));
            },
            policyFailed: () => {
                this.response.writeHead(401, {'Content-Type': 'application/json'});
                this.response.end(JSON.stringify({success: false, message: 'One or more policies prevented access to this route.'}));
            }
        };
    }

    load() {
        return this.response;
    }
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
    }
}