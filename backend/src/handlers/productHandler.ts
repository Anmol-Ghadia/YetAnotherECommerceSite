import { Request,Response } from "express";
import { checkId } from "../schema";
import { getProductByID, getProductByIDRange } from "../database";
import { sendBoundError,sendSuccessData,sendTypeError } from "./handlerHelpers";

export {
    handleSingleProductRequest,
    handleRangeProductRequest
}

// Handles requests related to single product, based on product id
async function handleSingleProductRequest(req:Request,res:Response) {
    // Check all params
    let productId = parseInt(req.params['productId']);
    
    // Check type
    if (isNaN(productId) || productId === null) {
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
async function handleRangeProductRequest(req:Request,res:Response) {
    // Check all params
    let startId = parseInt(req.params['startProductId']);
    let endId = parseInt(req.params['endProductId']);
    
    // Check type
    console.log("before type check:",startId,",",endId);
    if (isNaN(startId) || startId === null) {
        sendTypeError(res);
        return;
    }
    if (isNaN(endId) || endId === null) {
        sendTypeError(res);
        return;
    }

    // Check in bounds
    console.log("before bounds check:",startId,",",endId);
    if (!checkId(startId)) {
        sendBoundError(res);
        return;
    }
    if (!checkId(endId)) {
        sendBoundError(res);
        return;
    }

    let productJson = await getProductByIDRange(startId,endId);
    sendSuccessData(res,200,productJson);
    return;
}
