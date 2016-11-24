import { Request } from '../src/request';
import { Response } from '../src/response';
export declare class HomeHandler {
    static main(req: Request, res: Response): void;
    static post(req: Request, res: Response): void;
    static getById(req: Request, res: Response): void;
    static getByIdAndUsername(req: Request, res: Response): void;
}
