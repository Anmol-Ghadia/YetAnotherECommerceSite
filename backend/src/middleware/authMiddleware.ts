import { Request,Response, NextFunction } from 'express';
import { sendAuthError, sendSessionError } from '../handlers/handlerHelpers';
import { userExists } from '../database';
import { verifyToken } from './middlewareHelper';
import { log } from '../logger';

export async function authMiddleware (req:Request, res:Response, next:NextFunction) {    
    const header = req.headers.authorization;

    if(typeof header === 'undefined') {
        log(1,'AUTH','token not found');
        sendAuthError(res);
        return;
    }

    const token = header.split(' ')[1];
    const username = verifyToken(token);
    if (username == null) {
        log(1,'AUTH',`error verifying token at ${req.url}`);
        sendSessionError(res);
        return;
    }

    const exists = await userExists(username);
    if (!exists) {
        log(1,'CHECK',`username (${username}) is not valid`);
        sendSessionError(res);
        return;
    }

    log(2,'AUTH',`jwt valid for user (${username})`);
    req.headers.username = username;
    next();
}
