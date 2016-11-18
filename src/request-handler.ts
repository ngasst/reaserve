import { Route } from './router';
import { Request } from './request';
import { Response } from './response';

export class RequestHandler {
    constructor() {
        //
    }

    handle(handler: (req: Request, res: Response) => void, req: Request, res: Response): void {
        handler(req, res);
    }

}