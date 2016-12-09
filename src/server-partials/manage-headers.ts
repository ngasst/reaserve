import { Request, Response, RequestResponse, Header } from '../index';
import { createReadStream, ReadStream } from 'fs-extra';
import { CorsOptions } from '../index';

export function manageHeaders(
    r: RequestResponse,
    renderEngine: ((path: string, options?: any, done?: Function) => any) | string,
    cors: CorsOptions,
    ): RequestResponse {
    let response: Response = r.res;
        if(typeof cors !== 'undefined') {
            //set cors headers
                //origins
                (typeof cors.origins === 'array') ?
                    response.setHeader('Access-Control-Allow-Origin', cors.origins.join(', ')) :
                    response.setHeader('Access-Control-Allow-Origin', cors.origins);
                //request methods
                (typeof cors.requestMethods === 'array') ?
                    response.setHeader('Access-Control-Allow-Request-Method', cors.requestMethods.join(', ')) :
                    response.setHeader('Access-Control-Allow-Request-Method', cors.requestMethods);
                //methods
                (typeof cors.methods === 'array') ?
                    response.setHeader('Access-Control-Allow-Methods', cors.methods.join(', ')) :
                    response.setHeader('Access-Control-Allow-Methods', cors.methods);
                //headers
                if (typeof cors.headers === 'array') {
                    response.setHeader('Access-Control-Allow-Headers', cors.headers.join(', '))
                } else {
                    if (typeof cors.headers === 'string' && cors.headers === 'origin') {
                        response.setHeader('Access-Control-Allow-Headers', r.req.headers.origin);
                    } else {
                        response.setHeader('Access-Control-Allow-Headers', cors.headers);
                    }
                }
        }

        if (r.req.method === 'OPTIONS') {
            r.res.writeHead(200);
            r.res.end();
            return;
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