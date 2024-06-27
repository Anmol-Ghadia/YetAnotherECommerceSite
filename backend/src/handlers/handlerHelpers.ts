import { Response } from "express";
import jwt from 'jsonwebtoken';
export {
    sendSuccessData,
    sendTypeError,
    sendBoundError,
    sendGeneralError,
    generateJWT,
    sendServerError,
    sendAuthError,
    sendSessionError,
    sendPermissionError
}

function sendSuccessData(res: Response,code:number,data:any) {
    res.status(code);
    res.send({
        "success": true,
        "payload": data
    });
}


function sendServerError(res:Response, message:string) {
    let out = {
        success: false,
        payload: {
            message: `Internal Error: (${message})`
        }
    }
    res.status(500);
    res.send(out);
}

function sendTypeError(res:Response) {
    sendError(res,"Type Error");
}

function sendBoundError(res:Response) {
    sendError(res,"Bound Error");
}
function sendPermissionError(res:Response) {
    let out = {
        success: false,
        payload: {
            message: "Permission Error"
        }
    }
    res.status(403);
    res.send(out);
}

function sendAuthError(res: Response) {
    let out = {
        success: false,
        payload: {
            message: "Authentication Error"
        }
    }
    res.status(401);
    res.send(out);
}
function sendSessionError(res: Response) {
    let out = {
        success: false,
        payload: {
            message: "Session Error"
        }
    }
    res.status(401);
    res.send(out);
}

function sendError(res:Response,message:string) {
    let out = {
        success: false,
        payload: {
            message: message
        }
    }
    res.status(400);
    res.send(out);
}

function sendGeneralError(res:Response,description:string) {
    let out = {
        success: false,
        payload: {
            message: "General Error",
            description: description
        }
    }
    res.status(400);
    res.send(out);
}

// Generates a JWT for the given user name
// returns null for fatal errors
function generateJWT(username: string,validTime:number):string|null {
    console.log("PRIVATEKEY below");
    console.log(process.env.JWT_PRIVATE_KEY);
    let currentTime = Math.floor(Date.now() / 1000); 
    let payload:jwt.JwtPayload = {
        username:username,
        iat: currentTime,
        exp: currentTime + validTime
    };
    let key:jwt.Secret =process.env.JWT_PRIVATE_KEY as string; 
    try {
        let token = jwt.sign(payload, key)
        return token;
    } catch (err) {
        return null;
    }
}
