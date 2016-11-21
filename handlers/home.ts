import { Subscription } from '@reactivex/rxjs';
import { Request } from '../src/request';
import { Response } from '../src/response';

export class HomeHandler {
    static main(req: Request, res: Response): void {
        res.ok();
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

    static getById(req: Request, res: Response): void {
        let params: any = req.params;
        console.log(params);
        res.json(params);
    }

    static getByIdAndUsername(req: Request, res: Response): void {
        let params: any = req.params;
        console.log(params);
        console.log(req.parsedUrl);
        res.json(params);
    }
}