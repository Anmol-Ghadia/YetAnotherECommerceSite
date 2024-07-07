import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { 
    getUserHash, userExists, 
    getUserDetails, saveUser
} from '../database';
import { 
    sendBoundError, sendTypeError,
    sendGeneralError, sendSuccessData,
    generateJWT, sendServerError
} from './handlerHelpers';
import { 
    User, checkEmail, checkLongString,
    checkMediumString, checkPhoneNumber,
    checkTinyString, checkURL,
    checkUsername
} from '../database/schema';
import { log } from '../logger';

export async function handleLogin(req:Request,res:Response) {
    // Check all params
    const username = req.body['username'];
    const password = req.body['password'];

    // Check type
    if (typeof username !== 'string' ||
        typeof password !== 'string') {
        sendTypeError(res);
        return;
    }

    // Check in bounds
    if (!checkUsername(username) ||
        !checkMediumString(password)) {
        sendBoundError(res);
        return;
    }

    if (!(await userExists(username))) {
        sendGeneralError(res,'invalid username');
        return;
    }

    const savedHash = await getUserHash(username);

    if (!(await bcrypt.compare(password, savedHash))) {
        sendGeneralError(res,'invalid password');
        return;
    }
    
    const validTime = parseInt(process.env.JWT_SESSION_TIME as string);
    const token = generateJWT(username,validTime);
    if (token == null) {
        sendServerError(res,'authHandler1');
        return;
    }

    
    const userInfo = await getUserDetails(username);

    log(2,'LOGIN',`logged in by username (${username})`);
    const data = {
        token: token,
        validity: validTime,
        user: userInfo
    }
    sendSuccessData(res,202,data);
    return;
}


export async function handleRegister(req:Request,res:Response) {
    // Check all params
    const username = req.body['username'];
    const password = req.body['password'];
    const firstName = req.body['firstName'];
    const lastName = req.body['lastName'];
    const address = req.body['address'];
    const phone = req.body['phone'];
    const email = req.body['email'];
    const profilePhoto = req.body['profilePhoto'];

    // Check type
    if (typeof username !== 'string' ||
        typeof password !== 'string' ||
        typeof firstName !== 'string' ||
        typeof lastName !== 'string' ||
        typeof address !== 'string' ||
        typeof phone !== 'number' ||
        typeof email !== 'string' ||
        typeof profilePhoto !== 'string')
    {
        sendTypeError(res);
        return;
    }

    // Check in bounds
    if (!checkUsername(username) ||
        !checkMediumString(password) ||
        !checkTinyString(firstName) ||
        !checkTinyString(lastName) ||
        !checkLongString(address) ||
        !checkPhoneNumber(phone) ||
        !checkEmail(email) ||
        !checkURL(profilePhoto)) {
        sendBoundError(res);
        return;
    }

    if (await userExists(username)) {
        sendGeneralError(res,'username taken');
        return;
    }

    const hash = await bcrypt.hash(password, 10);
    if (typeof hash !== 'string' || hash.length == 0) {
        sendServerError(res,'authHandler2');
        return;
    }
    
    const newUser: User = {
        username:username,
        hash:hash,
        firstName:firstName,
        lastName:lastName,
        address:address,
        phone:phone,
        email:email,
        profilePhoto: profilePhoto
    }
    
    await saveUser(newUser);
    log(2,'SAVE',`Saved new User: ${username}`);
    sendSuccessData(res,201,{});
    return;
}

export function checkJWTValidity(req:Request,res:Response) {
    sendSuccessData(res,200,{});
}
