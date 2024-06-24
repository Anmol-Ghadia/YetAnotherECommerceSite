import { Request, Response } from "express";
import { sendBoundError, sendTypeError, sendGeneralError, sendSuccessData, generateJWT, sendServerError } from "./handlerHelpers";
import { checkMediumString, checkShortString } from "../schema";
import { getUserHash, userExists, getUserDetails } from "../database";
import bcrypt from 'bcrypt';


export {handleLogin};

async function handleLogin(req:Request,res:Response) {
    // Check all params
    let username = req.body['username'];
    let password = req.body['password'];

    // Check type
    if (typeof username !== 'string') {
        sendTypeError(res);
        return;
    }
    if (typeof password !== 'string') {
        sendTypeError(res);
        return;
    }

    // Check in bounds
    if (!checkShortString(username)) {
        sendBoundError(res);
        return;
    }
    if (!checkMediumString(password)) {
        sendBoundError(res);
        return;
    }

    if (!(await userExists(username))) {
        sendGeneralError(res,"invalid username");
        return;
    }

    const savedHash = await getUserHash(username);

    if (!(await bcrypt.compare(password, savedHash))) {
        sendGeneralError(res,"invalid password");
        return;
    }
    
    let validTime = parseInt(process.env.JWT_SESSION_TIME as string);
    const token = generateJWT(username,validTime);
    if (token == null) {
        sendServerError(res);
        return;
    }

    
    let userInfo = await getUserDetails(username);

    console.log('User logged in successfully!: ',username);
    let data = {
        token: token,
        validity: validTime,
        user: userInfo
    }
    sendSuccessData(res,200,data);
    return;
}
