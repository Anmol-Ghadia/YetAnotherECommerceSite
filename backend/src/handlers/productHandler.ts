import { Request,Response } from "express";
import { 
    checkId, checkLongString,
    checkMediumString, checkURLArray
} from "../schema";
import { 
    getProductByID, getProductByIDRange,
    makeProductListing, updateProductListing,
    isOwnerOfProduct,removeProduct,
    removeCartItemsByProductId
} from "../database";
import { 
    sendBoundError,sendServerError,
    sendSuccessData,sendTypeError,
    sendPermissionError
} from "./handlerHelpers";

// Handles requests related to single product, based on product id
export async function handleSingleProductRequest(req:Request,res:Response) {
    // Check all params
    let productId = parseInt(req.params['productId']);
    
    // Check type
    if (isNaN(productId) || typeof productId !== 'number') {
        sendTypeError(res);
        return;
    }

    // Check in bounds
    if (!checkId(productId)) {
        sendBoundError(res);
        return;
    }

    let productJson = await getProductByID(productId);
    sendSuccessData(res,200,productJson);
    return;
}

// Handles requests related to range of products, based on product id
export async function handleRangeProductRequest(req:Request,res:Response) {
    // Check all params
    let startId = parseInt(req.params['startProductId']);
    let endId = parseInt(req.params['endProductId']);
    
    // Check type
    if (isNaN(startId) || typeof startId !== 'number' ||
    isNaN(endId) || typeof endId !== 'number') {
        sendTypeError(res);
        return;
    }
    
    // Check in bounds
    if (!checkId(startId) || !checkId(endId)) {
        sendBoundError(res);
        return;
    }
    
    let productJson = await getProductByIDRange(startId,endId);
    sendSuccessData(res,200,productJson);
    return;
}

// Handles request to create new product
export async function handleCreateNewProductRequest(req:Request,res:Response) {
    // Check all params
    let name = req.body['name'];
    let username = req.headers.username;
    let description = req.body['description'];
    let price = req.body['price'];
    let images = req.body['images'];
    
    // Check type
    if (typeof username !== 'string') {
        sendServerError(res,"productHandler1");
        return;
    }
    if (typeof name !== 'string' ||
        typeof description !== 'string' ||
        isNaN(price) || typeof price !== 'number' ||
        typeof images !== 'object')
    {
        sendTypeError(res);
        return;
    }
        
    // Check in bounds
    if (!checkMediumString(name) ||
    !checkLongString(description) ||
    (price < 0) ||
    !checkURLArray(images)) {
        
        sendBoundError(res);
        return;
    }

    await makeProductListing(username,name,description,price,images);
    sendSuccessData(res,201,{});
    return;
}
    
// Handles request to update a product
export async function handleUpdateProductRequest(req:Request,res:Response) {
    // Check all params
    let productId = parseInt(req.params['productId']);
    let username = req.headers.username;
    let name = req.body['name'];
    let description = req.body['description'];
    let price = req.body['price'];
    let images = req.body['images'];
    
    // Check type
    if (typeof username !== 'string') {
        sendServerError(res,"productHandler2");
        return;
    }
    if (isNaN(productId) || typeof productId !== 'number' ||
    typeof name !== 'string' ||
        typeof description !== 'string' ||
        isNaN(price) || typeof price !== 'number' ||
        typeof images !== 'object')
    {
        sendTypeError(res);
        return;
    }

    // Check in bounds
    if (!checkId(productId) ||
    !checkMediumString(name) ||
    !checkLongString(description) ||
    (price < 0) ||
    !checkURLArray(images)) {
        
        sendBoundError(res);
        return;
    }

    // Check user is the owner of this product
    if (! await isOwnerOfProduct(productId,username)) {
        sendPermissionError(res);
        return;
    }
    
    await updateProductListing(productId,username,name,description,price,images);
    sendSuccessData(res,201,{});
    return;
}

// Handles request to delete a product listing
export async function handleRemoveProductRequest(req:Request,res:Response) {
    // Check all params
    let productId = parseInt(req.params['productId']);
    let username = req.headers.username;
    
    // Check type
    if (typeof username !== 'string') {
        sendServerError(res,"productHandler3");
        return;
    }
    if (isNaN(productId) || typeof productId !== 'number') {
        sendTypeError(res);
        return;
    }

    // Check in bounds
    if (!checkId(productId)) {
        sendBoundError(res);
        return;
    }

    // check user is owner of product
    if (! await isOwnerOfProduct(productId,username)) {
        sendPermissionError(res);
        return;
    }

    await removeProduct(productId);
    sendSuccessData(res,200,{});

    removeCartItemsByProductId(productId);
    return;
}

// Handles request to check ownership of product
export async function handleOwnershipRequest(req:Request,res:Response) {
    // Check all params
    let productId = parseInt(req.params['productId']);
    let username = req.headers.username;
    
    // Check type
    if (typeof username !== 'string') {
        sendServerError(res,"productHandler4");
        return;
    }
    if (isNaN(productId) || typeof productId !== 'number') {
        sendTypeError(res);
        return;
    }

    // Check in bounds
    if (!checkId(productId)) {
        sendBoundError(res);
        return;
    }

    // check user is owner of product
    if (! await isOwnerOfProduct(productId,username)) {
        sendPermissionError(res);
        return;
    }

    sendSuccessData(res,200,{});
    return;
}
