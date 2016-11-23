import { Route } from './router';
import { Request } from './request';
import { Response } from './response';
import { FinalRequestObject } from './server';

export class RequestHandler {
    constructor() {
        //
    }

    static handle(fr: FinalRequestObject): void {
        let pass: boolean = ((fr.exec || typeof fr.exec === 'undefined') && fr.pass);
        if (pass) {
            fr.route.handler(fr.req, fr.res);
        }
    }

}