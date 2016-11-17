import { FinalRequestObject } from '../src/server';
export class HomeHandler {
    static main(final: FinalRequestObject): void {
        final.reqres.res.response.ok();
    }
}