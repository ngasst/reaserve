import { Subscription } from '@reactivex/rxjs';
import { Request } from '../request';
import { Response } from '../response';

export class ErrorHandler {
    static routeNotFound(req: Request, res: Response): void {
        res.error.notFound();
    }

    static post(req: Request, res: Response): void {
        let sub: Subscription = req.body.subscribe(data => {
            res.json(data);
        },
        () => {
            sub.unsubscribe();
        },
        (err) => console.log(err));
    }
}