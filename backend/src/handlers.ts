import { Request,Response } from "express";
import { getProductByID,
    getProductByIDRange,
    userExists,
    saveUserAndHash,
    getUserHash 
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
    checkJWTValidity
};

// Products handler
async function handleSingleProductById(req: Request, res:Response) {
    let id = parseInt(req.params['productId']);
    let out = await getProductByID(id)
    if (out == null) {
        res.send("Prod Not foun`d");
        return;
    }
    res.send(out);
}

// Products handler for range of ids
async function handleRangeProductById(req:Request,res:Response) {
    let startId = parseInt(req.params['startProductId']);
    let endId = parseInt(req.params['endProductId']);
    let out = await getProductByIDRange(startId,endId);
    if (out.length == 0) {
        res.send('Nothing in range');
        return;
    }
    res.send(out);
}

// Handles request for validating token
async function checkJWTValidity(req:Request,res:Response) {
    const header = req.headers['authorization'];

    if(typeof header === 'undefined') {
        console.log("no token found");
        res.status(401);
        res.send("no token sent");
        return;
    }

    const token = header.split(' ')[1];
    let username = verifyToken(token);
    if (username == null) {
        console.log("Token not valid");
        res.status(401);
        res.send("Token invalid");
        return;
    }

    let exists = await userExists(username);
    if (!exists) {
        console.log("username not valid");
        res.status(401);
        res.send("username not valid");
        return;
    }

    console.log("jwt valid for user:",username);
    res.status(200);
    res.send("Valid session");
}

// Handles user Login attmpts
async function handleUserLogin(req:Request,res:Response) {
    let username = getLoginId(req);
    if (!(await userExists(username))) {
        console.log("User not registered:", username);
        res.status(401);
        res.send('Invalid username');
        return;
    }
    let savedHash = await getUserHash(username)
    bcrypt.compare(getPassword(req),
        savedHash,
        (err,result:boolean)=>{
        if (err != null) {
            console.log("Error during hash comparision for:",username);
            res.status(500);
            res.send();
            return;
        }
        if (result) {
            console.log('User logged in successfully!:',username);
            res.status(200);
            res.send(generateJWT(username));
        } else {
            console.log("Incorrect password for:",username);
            res.status(401);
            res.send("Incorrect password");
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
        res.send("username not available");
        return;
    }
    bcrypt.hash(getPassword(req), 10, (err,hash:string)=>{
        if (err != null) {
            console.log("Error generating hash for:",username);
            res.status(500);
            res.send("internal Server error");
            return;
        }
        saveUserAndHash(username,hash);
        console.log('Registered user:',username);
        res.status(200);
        res.send("Registration success");
    })
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
function generateJWT(username: string):string|null {
    console.log("PRIVATEKEY below");
    console.log(process.env.JWT_PRIVATE_KEY);
    let currentTime = Math.floor(Date.now() / 1000); 
    let payload:jwt.JwtPayload = {
        username:username,
        iat: currentTime,
        exp: currentTime + 100
    };
    let key:jwt.Secret =process.env.JWT_PRIVATE_KEY as string; 
    try {
        let token = jwt.sign(payload, key)
        return token;
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
