import { Route, RequestResponse, MatchedRequest, Request } from '../index';

export function manageRequestRouteRemapping(mr: MatchedRequest): MatchedRequest {
        let route: Route = mr.route;
        let req: Request = mr.reqres.req;
        let path: string = route.path;
        let url: string = req.url;
        let labelsregex = /:([a-zA-Z_-]+[^\W])/gi;
        let labels: string[] = [];
        let matches: string[] = [];

        while(matches = labelsregex.exec(path))
            labels.push(matches[1]);
        
        
        
        //requirete path url to match incoming request so it can be matched in the next step
        let matchBase: string[] = path.match(/^[^:]*/);
        let base: string = matchBase[0].trim();
        if (labels.length > 0 && !mr.reqres.asset) {
            let valuesArray: string[] = url.replace(base, '').split('/').filter(s => s.length > 0);
            let newPath: string = base.concat(valuesArray.join('/'));
            let qs: string = labels
                            //remove leading colon
                            .map(s => s.trim())
                            //since the labels and values have the same length, create queries in the form label=value
                            .map( (s, i) => `${s}=${valuesArray[i]}`)
                            .join('&');
            let newUrl: string = base
                                //remove trailing slash off the base
                                .trim()
                                .slice(0, base.length > 1 ? base.length - 1 : base.length)
                                //add a question mark (?) leading the query params
                                .concat('?')
                                .concat(qs);

            let newroute: Route = Object.assign(route, {matchedPath: newPath});
            let request: Request = Object.assign(req, {url: newUrl, unparsedUrl: newPath});
            let newreqres: RequestResponse = Object.assign(mr.reqres, {req: request});
            return Object.assign({}, {route: newroute, reqres: newreqres});
        }
        let request: Request = Object.assign(req, {unparsedUrl: req.url});
        let newreqres: RequestResponse = Object.assign(mr.reqres, {req: request});
        return Object.assign({}, {route: route, reqres: newreqres});
}