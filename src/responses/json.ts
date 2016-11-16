import { ServerResponse } from 'http';
export function json(json: any | Array<any>):void {
    this.writeHead(200, {'Content-Type': 'application/json'});
    this.end(JSON.stringify(json));
}