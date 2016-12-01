import { RequestResponse } from '../index';

export function manageAssets(r: RequestResponse): RequestResponse {
    //remap any incoming request asking for a common asset file to the assets folder
    let regex = /(^\/.*\.(jpg|jpeg|gif|json|png|js|svg|ico|js.map)$)/i;
    let match: string[] | null = r.req.url.match(regex);
    let testAssets: boolean = match !== null;

    return Object.assign(r, {asset: testAssets});
}