export {handleUserCartQuery,handleUserCartSpecificQuery,handleUserCartSpecificUpdate};
import { Request, Response } from "express";
import { sendBoundError, sendServerError, sendSuccessData, sendTypeError } from "./handlerHelpers";
import { checkId } from "../schema";
import { getUserCart,getUserCartForProduct,updateUserCart } from "../database";


// Handles request related to all items in a user's cart
async function handleUserCartQuery(req:Request,res:Response) {

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
async function handleUserCartSpecificQuery(req: Request, res:Response) {
    
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


async function handleUserCartSpecificUpdate(req: Request, res: Response) {
    
    // Check all params
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
