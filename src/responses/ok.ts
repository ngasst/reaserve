import { ServerResponse } from 'http';

export function ok(message: string = 'Success'):void {
    this.writeHead(200, {'Content-Type': 'application/json'});
    this.end(JSON.stringify({success: true, message}));
}