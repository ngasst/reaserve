import { Subscription } from '@reactivex/rxjs';
import { Request } from '../request';
import { Response } from '../response';

export class ErrorHandler {
    static routeNotFound(req: Request, res: Response): void {
        res.error.notFound();
    }

    static policyError(req: Request, res: Response): void {
        res.error.policyFailed();
    }
}