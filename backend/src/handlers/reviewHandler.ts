import { Request,Response } from "express";
import { Review, checkId } from "../schema";
import { getReviewsByProduct, getReviewStats } from "../database";
import { sendBoundError,sendSuccessData,sendTypeError } from "./handlerHelpers";
import { WithId } from "mongodb";

export {handleAllReviewsForProduct, handleReviewStats};

async function handleAllReviewsForProduct(req:Request,res:Response) {
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
    
        let reviewsCollection = await getReviewsByProduct(productId);
        sendSuccessData(res,200,reviewsCollection);
        return;
}

async function handleReviewStats(req:Request,res:Response) {
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

    const statsSummaryDocuments = await getReviewStats(productId);
    const statsSummary = computeStats(statsSummaryDocuments);
    sendSuccessData(res,200,statsSummary);
    return;
}


// Helper function to compute stats and return an object
function computeStats(docs: WithId<Review>[]) {
    let total = 0;
    let size = docs.length
    for (let index = 0; index < size ; index++) {
        total += docs[index].rating;
    }

    const rating = (total/size) - (total/size)%0.5;

    const outObject = {
        "rating": rating,
        "count": size
    }
    return outObject;
}
