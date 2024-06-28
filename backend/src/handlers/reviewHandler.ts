import { Request,Response } from "express";
import { Review, checkId, checkLongString, checkMediumString, checkRating } from "../schema";
import { getReviewsByProduct, getReviewStats, getUserReviews, createReview, updateReview, reviewExists, deleteReview } from "../database";
import { sendBoundError,sendGeneralError,sendPermissionError,sendServerError,sendSuccessData,sendTypeError } from "./handlerHelpers";
import { WithId } from "mongodb";

export {handleDeleteReview,handleReviewUpdate,handleAllReviewsForProduct, handleReviewStats,handleSingleAllReview,handleCreateReview};

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

async function handleSingleAllReview(req:Request,res:Response) {
    // Check all params
    let username = req.headers.username;

    // Check type
    if (typeof username !== 'string') {
        sendServerError(res,"reviewHandler1");
        return;
    }

    let reviewsJson = await getUserReviews(username);
    sendSuccessData(res,200,reviewsJson)
}

async function handleCreateReview(req:Request,res:Response) {

    // Check all params
    let username = req.headers.username;
    let productId = parseInt(req.params['productId']);
    let title = req.body.title;
    let description = req.body.description;
    let rating = req.body.rating;

    // Check type
    if (typeof username !== 'string') {
        sendServerError(res,"reviewHandler2");
        return;
    }
    if (isNaN(productId) || productId === null ||
        typeof title !== 'string'||
        typeof description !== 'string' ||
        typeof rating !== 'number') {
        sendTypeError(res);
        return;
    }

    // Check in bounds
    if (!checkId(productId) ||
        !checkMediumString(title) ||
        !checkLongString(description) ||
        !checkRating(rating)) {
        sendBoundError(res);
        return;
    }

    if (await reviewExists(username,productId)) {
        sendGeneralError(res,"Review already exists for this product");
        return;
    }

    await createReview(title,description,rating,username,productId);
    sendSuccessData(res,201,{});
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

// Handles update for a review
async function handleReviewUpdate(req:Request,res:Response) {
    
    let username = req.headers.username;
    let productId = parseInt(req.params['productId']);
    let title = req.body.title;
    let description = req.body.description;
    let rating = req.body.rating;

    // Check type
    if (typeof username !== 'string') {
        sendServerError(res,"reviewHandler3");
        return;
    }
    if (isNaN(productId) || productId === null ||
        typeof title !== 'string'||
        typeof description !== 'string' ||
        typeof rating !== 'number') {
        sendTypeError(res);
        return;
    }

    // Check in bounds
    if (!checkId(productId) ||
        !checkMediumString(title) ||
        !checkLongString(description) ||
        !checkRating(rating)) {
        sendBoundError(res);
        return;
    }

    if (! await reviewExists(username,productId)) {
        sendGeneralError(res,"Review does not exist");
        return;
    }

    await updateReview(username,productId,title,description,rating);
    sendSuccessData(res,200,{});
    return;
}

async function handleDeleteReview(req:Request,res:Response) {
    
    let username = req.headers.username;
    let productId = parseInt(req.params['productId']);

    // Check type
    if (typeof username !== 'string') {
        sendServerError(res,"reviewHandler4");
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

    if (! await reviewExists(username,productId)) {
        sendGeneralError(res,"Review does not exist");
        return;
    }

    await deleteReview(username,productId);
    sendSuccessData(res,200,{});
    return;
}
