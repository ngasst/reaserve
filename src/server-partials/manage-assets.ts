import { statSync, Stats } from 'fs-extra';
import { RequestResponse } from '../index';
import * as Path from 'path';

const mime = require('mime');

export function manageAssets(r: RequestResponse, assetsFolderName: string): RequestResponse {
    //remap any incoming request asking for a common asset file to the assets folder
    let regex = /(^\/.+\.[(js$)|(css$)|png$]+$)/;
    r.req.url = regex.exec(r.req.url) !== null ? r.req.url.replace(regex, `/assets$1`) : r.req.url;
    
    let regex2 = /(^\/assets\/assets)/;
    let testAssets = (regex2.exec(r.req.url) !== null);
    r.req.url = testAssets ? r.req.url.replace(regex2, `/assets`) : r.req.url;
    
    if(testAssets) {
        let type: string = mime.lookup(r.req.url);
        let path: string = Path.join(process.cwd(), r.req.url);
        let stats: Stats = statSync(path);
        r.res.sendFile(path, type, stats.size);
    }
    
    return Object.assign(r, {asset: testAssets});
}