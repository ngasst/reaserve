import { Route } from './router';
import { FinalRequestObject } from './server';

export class RequestHandler {
    constructor() {
        //
    }

    handle(fro: FinalRequestObject): void {
        fro.route.handler(fro);
    }

}