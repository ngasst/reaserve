import { Subscription } from '@reactivex/rxjs';
import { Request } from '../src/request';
import { Response } from '../src/response';
import { inspect } from 'util';

export class HomeHandler {
    static main(req: Request, res: Response): void {
        res.ok();
    }

    static post(req: Request, res: Response): void {
        //console.log(inspect(req, true, 5, true));
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
        res.json(params);
    }
}