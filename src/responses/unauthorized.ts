import { ServerResponse } from 'http';

export function unauthorized(message: string = 'You are not authorized to access this resource. Please make sure you are logged in!'):void {
    this.writeHead(401, {'Content-Type': 'application/json'});
    this.end(JSON.stringify({success: false, message}));
}