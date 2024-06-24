import { Request,Response } from "express";
import { checkId } from "../schema";
import { getProductByID, getProductByIDRange } from "../database";

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




// Helpers, put in a different file
function sendSuccessData(res: Response,code:number,data:any) {
    res.status(code);
    res.send({
        "success": true,
        "payload": data
    });
}


function sendTypeError(res:Response) {
    sendError(res,"Type Error");
}

function sendBoundError(res:Response) {
    sendError(res,"Bound Error");
}

function sendError(res:Response,message:string) {
    let out = {
        success: false,
        payload: {
            message: message
        }
    }
    res.status(400);
    res.send(out);
}
