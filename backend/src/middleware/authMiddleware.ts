import { Request,Response, NextFunction } from "express";
import { sendAuthError, sendSessionError } from "../handlers/handlerHelpers";
import { userExists } from "../database";
import { verifyToken } from "./middlewareHelper";

export async function authMiddleware (req:Request, res:Response, next:NextFunction) {    
    const header = req.headers.authorization;

    if(typeof header === 'undefined') {
        console.log("no token found");
        sendAuthError(res);
        return;
    }

    const token = header.split(' ')[1];
    const username = verifyToken(token);
    if (username == null) {
        console.log("Token not valid");
        sendSessionError(res);
        return;
    }

    const exists = await userExists(username);
    if (!exists) {
        console.log("username not valid");
        sendSessionError(res);
        return;
    }

    console.log(`jwt valid for user: ${username}`);
    req.headers.username = username;
    next();
}
