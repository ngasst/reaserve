import { Subscription } from '@reactivex/rxjs';
import { Request } from '../src/request';
import { Response } from '../src/response';
import { inspect } from 'util';
import { readJSON } from 'fs-extra';
import { renderFile } from 'pug';

export class HomeHandler {
    static main(req: Request, res: Response): void {
        readJSON('../hrm/assets/sandbox.json', (err, data) => {
            if (err) console.log(err);
            let display: string[] = data.map(d => d.name);
            let html = renderFile('views/main.pug', data);
            res.render(html);
        });
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
        res.json(params);
    }
    

    static getByIdAndUsername(req: Request, res: Response): void {
        let params: any = req.params;
        res.json(params);
    }
}