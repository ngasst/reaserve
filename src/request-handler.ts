import { Route } from './router';
import { Request } from './request';
import { Response } from './response';
import { FinalRequestObject } from './server';

export class RequestHandler {
    constructor() {
        //
    }

    static handle(fr: FinalRequestObject): void {
            if (!fr.asset && fr.pass)
                fr.route.handler(fr.req, fr.res);
    }

}