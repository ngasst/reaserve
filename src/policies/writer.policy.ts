import { SoRequest } from '../requests';

export function isWriter(req: SoRequest) {
    if(!req.user) {
        return false;
    }
    
    //set user from the request object!
    var user = req.user;
    
    //if this user's set of roles don't include 'writer', deny them access to resources.
    if (user.roles.indexOf('writer') !== -1) {
        return true;
    } else {
        return false;
    }
}