import { Response } from "express";
import jwt from 'jsonwebtoken';
import { WithId } from "mongodb";

export function sendSuccessData<T>(res: Response,code:number,data:WithId<T>[]|object) {
    res.status(code);
    res.send({
        "success": true,
        "payload": data
    });
}

export function sendServerError(res:Response, message:string) {
    const out = {
        success: false,
        payload: {
            message: `Internal Error: (${message})`
        }
    }
    res.status(500);
    res.send(out);
}

export function sendTypeError(res:Response) {
    sendError(res,"Type Error");
}

export function sendBoundError(res:Response) {
    sendError(res,"Bound Error");
}
export function sendPermissionError(res:Response) {
    const out = {
        success: false,
        payload: {
            message: "Permission Error"
        }
    }
    res.status(403);
    res.send(out);
}

export function sendAuthError(res: Response) {
    const out = {
        success: false,
        payload: {
            message: "Authentication Error"
        }
    }
    res.status(401);
    res.send(out);
}
export function sendSessionError(res: Response) {
    const out = {
        success: false,
        payload: {
            message: "Session Error"
        }
    }
    res.status(401);
    res.send(out);
}

export function sendError(res:Response,message:string) {
    const out = {
        success: false,
        payload: {
            message: message
        }
    }
    res.status(400);
    res.send(out);
}

export function sendGeneralError(res:Response,description:string) {
    const out = {
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
export function generateJWT(username: string,validTime:number):string|null {
    console.log("PRIVATEKEY below");
    console.log(process.env.JWT_PRIVATE_KEY);
    const currentTime = Math.floor(Date.now() / 1000); 
    const payload:jwt.JwtPayload = {
        username:username,
        iat: currentTime,
        exp: currentTime + validTime
    };
    const key:jwt.Secret =process.env.JWT_PRIVATE_KEY as string; 
    try {
        const token = jwt.sign(payload, key)
        return token;
    } catch (err) {
        return null;
    }
}
