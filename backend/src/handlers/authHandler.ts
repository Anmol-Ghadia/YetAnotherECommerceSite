import { Request, Response } from "express";
import { sendBoundError, sendTypeError, sendGeneralError, sendSuccessData, generateJWT, sendServerError } from "./handlerHelpers";
import { User, checkEmail, checkLongString, checkMediumString, checkPhoneNumber, checkShortString, checkTinyString, checkURL, checkUsername } from "../schema";
import { getUserHash, userExists, getUserDetails, saveUser } from "../database";
import bcrypt from 'bcrypt';


export {handleLogin,handleRegister};

async function handleLogin(req:Request,res:Response) {
    // Check all params
    let username = req.body['username'];
    let password = req.body['password'];

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
        sendServerError(res,"authHandler1");
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


async function handleRegister(req:Request,res:Response) {
    // Check all params
    let username = req.body['username'];
    let password = req.body['password'];
    let firstName = req.body['firstName'];
    let lastName = req.body['lastName'];
    let address = req.body['address'];
    let phone = req.body['phone'];
    let email = req.body['email'];
    let profilePhoto = req.body['profilePhoto'];

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
        sendGeneralError(res,"username taken");
        return;
    }

    const hash = await bcrypt.hash(password, 10);
    if (typeof hash !== 'string' || hash.length == 0) {
        sendServerError(res,"authHandler2");
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
    console.log(`Saved new User: ${username}`);
    sendSuccessData(res,200,{});
    return;
}
