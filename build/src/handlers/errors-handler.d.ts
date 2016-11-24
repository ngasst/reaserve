import { Request } from '../request';
import { Response } from '../response';
export declare class ErrorHandler {
    static routeNotFound(req: Request, res: Response): void;
    static policyError(req: Request, res: Response): void;
}
