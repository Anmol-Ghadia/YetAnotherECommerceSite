import { Request,Response } from 'express'
import { checkSearchString, checkUsername } from '../database/schema';
import { sendBoundError, sendSuccessData, sendTypeError } from './handlerHelpers';
import { queryReadUser } from '../database/queries/userQueries';
import { queryReadProductsBySearchString, queryReadRandomProducts } from '../database/queries/productQueries';

export async function handleUserNameInformation(req:Request, res:Response) {
    // Check all params
    const username = req.params['username'];

    // Check type
    if (typeof username !== 'string') {
        sendTypeError(res);
        return;
    }

    // Check in bounds
    if (!checkUsername(username)) {
        sendBoundError(res);
        return;
    }

    const userDetails = await queryReadUser(username);
    if (userDetails == null) {
        sendSuccessData(res,202,{});
        return;
    }

    sendSuccessData(res,202,{
        firstName:userDetails.firstName,
        lastName:userDetails.lastName
    });
    return;
}

export async function handleSearch(req:Request,res:Response) {
    
    const minPrice = req.body['minPrice'];
    const maxPrice = req.body['maxPrice'];
    const quantity = req.body['quantity'];
    let search = req.body['search'];

    // Check type
    if (isNaN(minPrice) || typeof minPrice !== 'number' ||
        isNaN(maxPrice) || typeof maxPrice !== 'number' ||
        isNaN(quantity) || typeof quantity !== 'number' ||
        typeof search !== 'string')
    {
        sendTypeError(res);
        return;
    }

    search = search.trim();

    // Check bounds
    if (minPrice < 0 ||
        maxPrice < 0 ||
        quantity < 0 ||
        !checkSearchString(search))
    {
        sendBoundError(res);
        return;
    }

    if (search.length == 0) {
        const searchedDocs = await queryReadRandomProducts(minPrice,maxPrice,quantity);
        sendSuccessData(res,200,searchedDocs);
        return;
    }

    const searchedDocs = await queryReadProductsBySearchString(search,minPrice,maxPrice,quantity);
    sendSuccessData(res,200,searchedDocs);
    return;
}
