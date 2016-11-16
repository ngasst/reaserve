import { ServerResponse } from 'http';
export function payload(payload: Object, message: string):void {
    this.writeHead(200, {'Content-Type': 'application/json'});
    this.end(JSON.stringify({success: true, payload, message}));
}