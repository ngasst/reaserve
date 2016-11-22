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

        this.response.render = (html: string): void => {
            this.response.writeHead(200, {'Content-Type': 'text/html'});
            this.response.end(html);
            /*readFile(path, 'utf8', (err: NodeJS.ErrnoException, html: string) => {
                if (err) {
                    this.response.writeHead(500, {'Content-Type': 'text/html'});
                    this.response.end(`
                    <h1>Error</h1>
                    <h2>${err}</h2>
                    `);
                }
                let regex = /\${[a-z_]+\.?([a-z_]+?)?}/gm;
                let keys: string[] = [];
                let match = regex.exec(html);
                while(match != null) {
                    keys.push(match[1]);
                    match = regex.exec(html);
                }
                keys = keys.filter(s => typeof s !== 'undefined');
                let compiled: string = html.replace('${data}', JSON.stringify(data));
                let i = 0;
                while(i < keys.length) {
                    let needle: string = '${data.'+keys[i]+'}';
                    compiled = compiled.replace(needle, data[keys[i]]);
                    i = i+1;
                }
                this.response.writeHead(200, {'Content-Type': 'text/html'});
                this.response.end(compiled);
            });*/
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