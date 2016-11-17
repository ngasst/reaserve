import { ServerRequest, ServerResponse } from 'http';

export class Response {
    response: IResponse;

    constructor(res: ServerResponse|Response|IResponse) {
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
    }
}

export interface IResponse extends ServerResponse {
    json: (json: any) => void;
    ok: (message?: string) => void;
    unauthorized: (message?: string) => void;
}