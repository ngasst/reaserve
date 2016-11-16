import { ServerResponse } from 'http';

export function bad(message: string = 'Bad Request!'):void {
    this.writeHead(400, {'Content-Type': 'application/json'});
    this.end(JSON.stringify({success: false, message}));
}