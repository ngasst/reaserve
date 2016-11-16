import * as express from 'express';
import { ISoRequest, ISoResponse } from '../responses/interface';

export function login(req: ISoRequest, res: ISoResponse, next: express.NextFunction) {
    if(!req.user) {
        return res.unauthorized('You are not signed in. Please login.');
    }
    
    //set user from the request object!
    var user = req.user;
    
    //if this user's set of roles don't include 'admin', deny them access to resources.
    if (!(user.roles.indexOf('admin') > -1)) {
        return res.unauthorized('You do not have permission to access this resource!');
    } 
    
    next();   
}