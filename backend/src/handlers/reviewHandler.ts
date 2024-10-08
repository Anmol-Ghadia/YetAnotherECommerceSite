import { Request,Response } from 'express';
import { 
    Review, checkId,
    checkLongString,
    checkMediumString,
    checkRating
} from '../database/schema';
import { 
    sendBoundError,sendGeneralError,
    sendServerError,sendSuccessData,
    sendTypeError
} from './handlerHelpers';
import { queryCreateReview, queryDeleteReview, queryReadAllReviewsForProduct, queryReadReviewsForUser, queryReviewExists, queryUpdateReview } from '../database/queries/reviewQueries';

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
    
        const reviewsCollection = await queryReadAllReviewsForProduct(productId);
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

    const reviews = await queryReadAllReviewsForProduct(productId);
    if (reviews == null) {
        sendSuccessData(res,200,{
            'rating': 0,
            'count': 0
        });
        return;
    }
    const statsSummary = computeStats(reviews);
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

    const reviewsJson = await queryReadReviewsForUser(username);
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

    if (await queryReviewExists(username,productId)) {
        sendGeneralError(res,'Review already exists for this product');
        return;
    }

    const newReview: Review = {
        title:title,
        description:description,
        rating:rating,
        username:username,
        productId:productId
    }

    await queryCreateReview(newReview);
    sendSuccessData(res,201,{});
    return;
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

    if (! await queryReviewExists(username,productId)) {
        sendGeneralError(res,'Review does not exist');
        return;
    }

    const updatedReview:Review = {
        username:username,
        productId:productId,
        title:title,
        description:description,
        rating:rating
    }
    await queryUpdateReview(updatedReview);
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

    if (! await queryReviewExists(username,productId)) {
        sendGeneralError(res,'Review does not exist');
        return;
    }

    await queryDeleteReview(username,productId);
    sendSuccessData(res,200,{});
    return;
}

// ====== HELPERS ======

// Helper function to compute stats and return an object
function computeStats(docs: Review[]) {
    let total = 0;
    let rating = 0;
    const size = docs.length;
    for (let index = 0; index < size ; index++) {
        total += docs[index].rating;
    }

    if (size != 0) {
        rating = (total/size) - (total/size)%0.5;
    }

    const outObject = {
        'rating': rating,
        'count': size
    }
    return outObject;
}
