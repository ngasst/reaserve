import { SoRequest } from '../requests';
import { AppConfig } from '../config/config';

const config = new AppConfig();

export function authenticated(req: SoRequest) {
    return new Promise((resolve, reject) => {
        if(!req.headers.authorization) {
            resolve(false);
        }
    
        let token: string = req.headers.authorization.split(' ')[1];
        
        config.verifyToken(token)
        .then(payload => {
            resolve(true);
        })
        .catch(err => {
            //console.log(err);
            resolve(false);
        });
    });
}