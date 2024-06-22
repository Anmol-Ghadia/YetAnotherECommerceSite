import { Request,Response } from "express";
import { getProductByID,
    getProductByIDRange,
    userExists,
    saveUserAndHash,
    getUserHash ,
    getProductQuery,
    getUserCartForProduct
} from "./database";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export {
    handleSingleProductById,
    handleRangeProductById,
    handleUserLogin,
    handleUserRegister,
    checkJWTValidity,
    handleProductQuery,
    handleCartQuery
};

// Products handler
async function handleSingleProductById(req: Request, res:Response) {
    let id = parseInt(req.params['productId']);
    if (typeof id === 'undefined' ) {
        sendResponse(res,false,{message:"invalid numbers"});
        return;
    }
    let out = await getProductByID(id)
    if (out == null) {
        sendResponse(res,false,{message:'Product does not exist'});
        return;
    }
    sendResponse(res,true,out);
}

// Products handler for range of ids
async function handleRangeProductById(req:Request,res:Response) {
    let startId = parseInt(req.params['startProductId']);
    let endId = parseInt(req.params['endProductId']);
    if (typeof startId === 'undefined' ||
        typeof endId === 'undefined') {
        sendResponse(res,false,{message:"invalid numbers"});
        return;
    }
    let out = await getProductByIDRange(startId,endId);
    if (out.length == 0) {
        sendResponse(res,false,{message:'Nothing in range'});
        return;
    }
    sendResponse(res,true,out);
}

async function handleProductQuery(req:Request, res:Response) {
    if (typeof req.body['quantity'] !== 'string' ||
        typeof req.body['minPrice'] !== 'string' ||
        typeof req.body['maxPrice'] !== 'string') {
        sendResponse(res,false,{message:"invalid Params (type)"});
        return;
    }
    const quantity = parseInt(req.body['quantity']);
    const minPrice = parseInt(req.body['minPrice']);
    const maxPrice = parseInt(req.body['maxPrice']);
    if (typeof quantity === 'undefined' ||
        typeof minPrice === 'undefined' ||
        typeof maxPrice === 'undefined') {
        sendResponse(res,false,{message:"invalid Params (number)"});
        return;
    }

    let out = await getProductQuery(quantity,minPrice,maxPrice);
    if (out.length == 0) {
        sendResponse(res,false,{message:'Nothing found by Query'});
        return;
    }
    sendResponse(res,true,out);
}

// Handles request for validating token
async function checkJWTValidity(req:Request,res:Response) {
    // const header = req.headers['authorization'];
    const header = req.cookies.token;

    if(typeof header === 'undefined') {
        console.log("no token found");
        res.status(401);
        sendResponse(res,false,{message:"no token sent"});
        return;
    }

    const token = header.split(' ')[1];
    let username = verifyToken(token);
    if (username == null) {
        console.log("Token not valid");
        res.status(401);
        sendResponse(res,false,{message:"Token invalid"});
        return;
    }

    let exists = await userExists(username);
    if (!exists) {
        console.log("username not valid");
        res.status(401);
        sendResponse(res,false,{message:"username not valid"});
        return;
    }

    console.log("jwt valid for user:",username);
    res.status(200);
    sendResponse(res,true,{message:"Valid session"})
}

// Handles user Login attmpts
async function handleUserLogin(req:Request,res:Response) {
    let username = getLoginId(req);
    if (!(await userExists(username))) {
        console.log("User not registered:", username);
        res.status(401);
        sendResponse(res,false,{message:"Invalid username"});
        return;
    }
    let savedHash = await getUserHash(username)
    bcrypt.compare(getPassword(req),
        savedHash,
        (err,result:boolean)=>{
        if (err != null) {
            console.log("Error during hash comparision for:",username);
            res.status(500);
            sendResponse(res,false,{message:"Server Error"});
            return;
        }
        if (result) {
            console.log('User logged in successfully!:',username);
            res.status(200);
            let validTime = parseInt(process.env.JWT_SESSION_TIME as string);
            sendResponse(res,true,{token:generateJWT(username,validTime),validity:validTime});
        } else {
            console.log("Incorrect password for:",username);
            res.status(401);
            sendResponse(res,false,{message:"Incorrect password"});
            return;
        }
    })
}

async function handleUserRegister(req:Request,res:Response) {
    let username = getLoginId(req);
    let userInDatabase = await userExists(username);
    if (userInDatabase) {
        console.log('user name already exists:',username);
        res.status(401);
        sendResponse(res,false,{message:"username not available"});
        return;
    }
    bcrypt.hash(getPassword(req), 10, (err,hash:string)=>{
        if (err != null) {
            console.log("Error generating hash for:",username);
            res.status(500);
            sendResponse(res,false,{message:"Server Error"});
            return;
        }
        saveUserAndHash(username,hash);
        console.log('Registered user:',username);
        res.status(200);
        sendResponse(res,true,{message:"Registration success"});
    })
}

async function handleCartQuery(req:Request,res:Response) {
    if (!isJWTValid(req)) {
        res.status(401);
        sendResponse(res,false,{message:'JWT invalid'});
        return;
    }

    let username = req.body['username'] as string;
    let productId = req.body['productId'] as string;

    if (username == null || productId == null) {
        res.status(400);
        sendResponse(res,false,{message:'Invalid body'});
        return;
    }

    let productIdInt = parseInt(productId);

    if (typeof productIdInt !== 'number') {
        res.status(400);
        sendResponse(res,false,{message:'Type error'});
        return;
    }

    let cartItem = await getUserCartForProduct(username,productIdInt);
    if (cartItem == null) {
        res.status(200);
        sendResponse(res,true,{amount:0});
        return;
    }
    res.status(200);
    sendResponse(res,true,{amount:cartItem['quantity']});
    return;

}

// Returns the parameter value for username in body
function getLoginId(req:Request) {
    return req.body['username'];
}

// Returns the parameter value for password in body
function getPassword(req:Request) {
    return req.body['password'];
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
        return 'Bearer ' + token;
    } catch (err) {
        return null;
    }
}

// Returns the username if token is valid
// null otherwise
function verifyToken(token:string):string|null {
    let key:jwt.Secret = process.env.JWT_PRIVATE_KEY as string;
    try {
        let decoded = jwt.verify(token,key) as jwt.JwtPayload;
        return decoded.username;
    } catch (err) {
        console.log("Error verifying token");
        return null;
    }
}

// sends a json payload
function sendResponse(res:Response,success:boolean,body:Object) {
    let out = {
        success: success,
        payload: body
    }
    res.send(out);
}

// Handles request for validating token,
//    Does not query DB
function isJWTValid(req:Request) {
    // const header = req.headers['authorization'];
    const header = req.cookies.token;

    if(typeof header === 'undefined') {
        return false;
    }
    
    const token = header.split(' ')[1];
    let username = verifyToken(token);
    if (username == null) {
        return false;
    }

    return true;
}
