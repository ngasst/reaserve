import { Route } from './router';
import { Request } from './request';
import { Response } from './response';
import { FinalRequestObject } from './server';

export class RequestHandler {
    constructor() {
        //
    }

    static handle(fr: FinalRequestObject): void {
        let pass: boolean = ((!fr.asset || typeof fr.asset === 'undefined') && fr.pass);
        if (pass) {
            fr.route.handler(fr.req, fr.res);
            
        }
    }

}