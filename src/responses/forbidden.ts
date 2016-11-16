import { ServerResponse } from 'http';

export function forbidden(message: string = 'You are not authorized to access this resource.'):void {
    this.writeHead(403, {'Content-Type': 'application/json'});
    this.end(JSON.stringify({success: false, message}));
}