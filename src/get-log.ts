import { SoRequest } from './requests';
import * as moment from 'moment';

export function getLog(req: SoRequest): string {
    let logArray = [
        req.socket.localAddress.toString().match(new RegExp(/\d.*/)),
        req.httpVersion,
        req.method,
        req.url,
        req.socket.remoteAddress.toString().match(new RegExp(/\d.*/)),
        req.socket.localPort,
        req.socket.remotePort
    ];

    let logString = logArray.reduce((acc: string, val: string) => acc.concat(` ${val}`), '').toString().trim();
    return logString;
    
}