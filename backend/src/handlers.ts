import { Request,Response } from "express";
import { getProductByID,
    getProductByIDRange,
    userExists,
    saveUserAndHash,
    getUserHash 
} from "./database";
import bcrypt from 'bcrypt';

export {
    handleSingleProductById,
    handleRangeProductById,
    handleUserLogin,
    handleUserRegister
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
            res.send("Logged in")
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
