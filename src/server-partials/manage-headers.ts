import { Request, Response, RequestResponse, Header } from '../index';
import { createReadStream, ReadStream } from 'fs-extra';

export function manageHeaders(
    r: RequestResponse,
    renderEngine: ((path: string, options?: any, done?: Function) => any) | string,
    allowedMethods: string[],
    allowedHeaders: string[],
    allowedOrigins: string | string[],
    additionalHeaders: Header[]
    ): RequestResponse {
    let response: Response = r.res;
        if ((typeof allowedOrigins === 'array' && allowedOrigins.length > 0)) {
            response.setHeader('Access-Control-Allow-Origin', allowedOrigins.join(','));
            response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            response.setHeader('Access-Control-Allow-Headers', 'Content-Type,Accept');
            response.setHeader('Content-Type', 'application/json');
        } else {
            if (typeof allowedOrigins === 'string' && allowedOrigins.length > 0) {
                response.setHeader('Access-Control-Allow-Origin', allowedOrigins);
                response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
                response.setHeader('Access-Control-Allow-Headers', 'Content-Type,Accept');
                response.setHeader('Content-Type', 'application/json');
            }
        }

        if ((allowedMethods.length > 0))
            response.setHeader('Access-Control-Allow-Methods', allowedMethods.join(','));
        
        if ((allowedHeaders.length > 0))
            response.setHeader('Access-Control-Allow-Headers', allowedHeaders.join(','));

        if (r.req.method === 'OPTIONS') {
            r.res.writeHead(200);
            r.res.end();
        }

        if (additionalHeaders.length > 0) {
            additionalHeaders.forEach((h: Header) => {
                response.setHeader(h.key, h.value);
            });
        }

        //give the response the ability to send back responses
        response.sendFile = (path: string, ct: string, size?: number): void => {
            let rs: ReadStream = createReadStream(path);
                r.res.setHeader('Content-Type', ct);
                if (size !== null && typeof size !== 'undefined')
                    r.res.setHeader('Content-Length', `${size}`);
                r.res.writeHead(200);
                rs.pipe(r.res);
        }

        //check if a render engine was provided; if so, use it; otherwise, use default render method;
        if (typeof renderEngine === 'string') {
            //check if this is the default render engine and define basic render method
            if (renderEngine === 'default') {
                response.render = (html: string): void => {
                    response.writeHead(200, {'Content-Type': 'text/html'});
                    response.end(html);
                }              
            }
        } else {
            response.render = (path: string, options: any): void => {
                renderEngine(path, options, (err, data) => {
                    if (err){
                        response.writeHead(500, {'Content-Type': 'text/html'});
                        response.end(data);
                    } else {
                        response.writeHead(200, {'Content-Type': 'text/html'});
                        response.end(data);
                    }
                });
            }
        }
        return {req: r.req, res: response};
}