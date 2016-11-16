import { ServerResponse } from 'http';

export function error() {
    return {
        generic: (statusNumber: number = 404, message: string = 'Resource not found'):void => {
            this.writeHead(statusNumber, {'Content-Type': 'application/json'});
            this.end(JSON.stringify({success: false, message: message}));
        },
        serverError: () => {
            this.writeHead(500, {'Content-Type': 'application/json'});
            this.end(JSON.stringify({success: false, message: 'Something went wrong on the server. Please try again later.'}));
        },
        notFound: () => {
            this.writeHead(404, {'Content-Type': 'application/json'});
            this.end(JSON.stringify({success: false, message: 'Resource Not Found'}));
        }
    };
}

export interface ErrorMessages{
    generic: (statusCode: number, message: string) => void;
    serverError: () => void;
    notFound: () => void;
}