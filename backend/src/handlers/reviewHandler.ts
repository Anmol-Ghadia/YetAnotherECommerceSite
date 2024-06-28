import { Request,Response } from 'express';
import { 
    Review, checkId,
    checkLongString,
    checkMediumString,
    checkRating
} from '../schema';
import { 
    getReviewsByProduct, getReviewStats,
    getUserReviews, createReview,
    updateReview, reviewExists,
    deleteReview
} from '../database';
import { 
    sendBoundError,sendGeneralError,
    sendServerError,sendSuccessData,
    sendTypeError
} from './handlerHelpers';

export async function handleAllReviewsForProduct(req:Request,res:Response) {
        // Check all params
        const productId = parseInt(req.params['productId']);
    
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
    
        const reviewsCollection = await getReviewsByProduct(productId);
        sendSuccessData(res,200,reviewsCollection);
        return;
}

export async function handleReviewStats(req:Request,res:Response) {
    // Check all params
    const productId = parseInt(req.params['productId']);

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

export async function handleSingleAllReview(req:Request,res:Response) {
    // Check all params
    const username = req.headers.username;

    // Check type
    if (typeof username !== 'string') {
        sendServerError(res,'reviewHandler1');
        return;
    }

    const reviewsJson = await getUserReviews(username);
    sendSuccessData(res,200,reviewsJson)
}

export async function handleCreateReview(req:Request,res:Response) {

    // Check all params
    const username = req.headers.username;
    const productId = parseInt(req.params['productId']);
    const title = req.body.title;
    const description = req.body.description;
    const rating = req.body.rating;

    // Check type
    if (typeof username !== 'string') {
        sendServerError(res,'reviewHandler2');
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
        sendGeneralError(res,'Review already exists for this product');
        return;
    }

    await createReview(title,description,rating,username,productId);
    sendSuccessData(res,201,{});
    return;
}

// Helper function to compute stats and return an object
function computeStats(docs: Review[]) {
    let total = 0;
    const size = docs.length
    for (let index = 0; index < size ; index++) {
        total += docs[index].rating;
    }

    const rating = (total/size) - (total/size)%0.5;

    const outObject = {
        'rating': rating,
        'count': size
    }
    return outObject;
}

// Handles update for a review
export async function handleReviewUpdate(req:Request,res:Response) {
    
    const username = req.headers.username;
    const productId = parseInt(req.params['productId']);
    const title = req.body.title;
    const description = req.body.description;
    const rating = req.body.rating;

    // Check type
    if (typeof username !== 'string') {
        sendServerError(res,'reviewHandler3');
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
        sendGeneralError(res,'Review does not exist');
        return;
    }

    await updateReview(username,productId,title,description,rating);
    sendSuccessData(res,200,{});
    return;
}

export async function handleDeleteReview(req:Request,res:Response) {
    
    const username = req.headers.username;
    const productId = parseInt(req.params['productId']);

    // Check type
    if (typeof username !== 'string') {
        sendServerError(res,'reviewHandler4');
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
        sendGeneralError(res,'Review does not exist');
        return;
    }

    await deleteReview(username,productId);
    sendSuccessData(res,200,{});
    return;
}
