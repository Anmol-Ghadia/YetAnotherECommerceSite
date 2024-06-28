import { Request, Response } from "express";
import { 
    sendBoundError, sendGeneralError,
    sendServerError, sendSuccessData,
    sendTypeError
} from "./handlerHelpers";
import { 
    checkEmail, checkId, checkLongString,
    checkMediumString, checkPhoneNumber,
    checkTinyString, checkURL
} from "../schema";
import { 
    getUserCart,getUserCartForProduct,
    updateUserCart,updateUser,
    userExists, deleteUser
} from "../database";


// Handles request related to all items in a user's cart
export async function handleUserCartQuery(req:Request,res:Response) {

    // Check all params
    let username = req.headers.username;

    // Check type
    if (typeof username !== 'string') {
        sendServerError(res,"cartHandler1");
        return;
    }

    let cartItemsJson = await getUserCart(username);
    sendSuccessData(res,200,cartItemsJson)
}

// Handles request related to specific item in a user's cart
export async function handleUserCartSpecificQuery(req: Request, res:Response) {
    
    // Check all params
    let username = req.headers.username;
    let productId = parseInt(req.params['productId']);
    
    // Check type
    if (typeof username !== 'string') {
        sendServerError(res,"cartHandler2");
        return;
    }
    if (isNaN(productId) || productId === null) {
        sendTypeError(res);
        return;
    }

    // Check in bounds
    if (!checkId(productId)) {
        sendBoundError(res);
        return;
    }

    let productJson = await getUserCartForProduct(username,productId);
    if (productJson === null) {
        sendSuccessData(res,200,{"quantity":0});
    } else {
        sendSuccessData(res,200,productJson);
    }
    return;
}

export async function handleUserCartSpecificUpdate(req: Request, res: Response) {
    
    // Get all params
    let username = req.headers.username;
    let productId = parseInt(req.params['productId']);
    let quantity = parseInt(req.body['quantity']);
    
    // Check type
    if (typeof username !== 'string') {
        sendServerError(res,"cartHandler3");
        return;
    }
    if (isNaN(productId) ||
        productId === null ||
        isNaN(quantity) ||
        quantity === null) {
        sendTypeError(res);
        return;
    }

    // Check in bounds
    if (!checkId(productId) ||
        (quantity < 0)) {
        sendBoundError(res);
        return;
    }

    await updateUserCart(username,productId,quantity);
    sendSuccessData(res,201,{});
    return;
}

// Handles requests to update user details
export async function handleUpdateUserDetails(req:Request,res:Response) {
    
    // Get all params
    let username = req.headers.username;
    let firstName = req.body['firstName'];
    let lastName = req.body['lastName'];
    let address = req.body['address'];
    let phone = req.body['phone'];
    let email = req.body['email'];
    let profilePhoto = req.body['profilePhoto'];

    // Check type
    if (typeof username !== 'string') {
        sendServerError(res,"cartHandler4");
        return;
    }
    if (typeof firstName !== 'string' ||
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
    if (!checkTinyString(firstName) ||
        !checkTinyString(lastName) ||
        !checkLongString(address) ||
        !checkPhoneNumber(phone) ||
        !checkEmail(email) ||
        !checkURL(profilePhoto)) {
        sendBoundError(res);
        return;
    }

    await updateUser(username,firstName,lastName,address,phone,email,profilePhoto);
    console.log(`Updated User details: ${username}`);
    sendSuccessData(res,200,{});
    return;
}

export async function handleDeleteUser(req:Request,res:Response) {
    // Check all params
    let username = req.headers.username;
    let password = req.body['password'];

    // Check type
    if (typeof username !== 'string') {
        sendServerError(res,"cartHandler5");
        return;
    }
    if (typeof password !== 'string') {
        sendTypeError(res);
        return;
    }

    // Check in bounds
    if (!checkMediumString(password)) {
        sendBoundError(res);
        return;
    }

    if (!(await userExists(username))) {
        sendGeneralError(res,"username already deleted");
        return;
    }

    deleteUser(username);    
    sendSuccessData(res,200,{});
    // TODO !!! delete all user related reviews and cart
    return;
}
