import { Request, Response } from './index';
import { statSync, Stats } from 'fs-extra';
import * as Path from 'path';
const mime = require('mime');

export class AssetHandler {
    static serve(req: Request, res: Response, assetsFolderName: string): void {
        let path: string = Path.join(process.cwd(), assetsFolderName, req.url);
        let type: string = mime.lookup(path);
        let stats: Stats = statSync(path);
        res.sendFile(path, type, stats.size);
    }
}