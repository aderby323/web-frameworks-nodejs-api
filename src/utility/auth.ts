import jwt from 'jsonwebtoken';
import { IncomingHttpHeaders } from "http";
import { User } from "../models/user";
import { Token } from './token';

export class Auth {
    static sequenceKey: string = 'B45E162EB1FBAB659F7918D36CAB566E932E76FED81BD79A6A811FA28E0C6F5C';

    static Verify(headers: IncomingHttpHeaders) {
        if(headers.authorization != null && headers.authorization.split(' ')[0] == 'Bearer') {
            try {
                let token = headers.authorization.split(' ')[1];
                let currentUser = jwt.verify(token, Auth.sequenceKey);
                if(currentUser) { return true; }
            } catch (exception) { console.log(exception) }
        }
        return false;
    }

    static Parse(token: string) : string | boolean {
        if (token != null) {
            let userdata = jwt.decode(token, {json: true});
            token = userdata!["userData"].userId;
            return token;
        } else {
            return false;
        }
    }

    static CreateToken(user: User) {
        return jwt.sign({userData:user.toJSON(user)}, Auth.sequenceKey, {expiresIn: '1h'});
    }
}

