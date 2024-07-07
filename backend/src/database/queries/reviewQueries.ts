import { Db, Filter, FindOptions, WithoutId } from "mongodb";
import Cache from "../cache";
import { Review } from "../schema";
import { log } from "../../logger";

let REVIEW_COLLECTION:string;
// let REVIEW_CACHE: Cache<Review>;
let DB: Db;

export function initializeReviewQueries(REVIEW_COLLECTION_NAME:string, givenREVIEW_CACHE:Cache<Review>, givenDB:Db) {
    REVIEW_COLLECTION = REVIEW_COLLECTION_NAME;
    // REVIEW_CACHE = givenREVIEW_CACHE;
    DB = givenDB;
}

// Read multiple reviews by productId
export async function queryReadAllReviewsForProduct(productId:number): Promise<WithoutId<Review>[] | null> {
    
    const query: Filter<Review> = {
        'productId': { $eq: productId }
    };

    const dbReviews:WithoutId<Review>[] = await DB
        .collection<Review>(REVIEW_COLLECTION)
        .find(query)
        .toArray();

    // REVIEW_CACHE.pushAll(dbReviews);
    log(2,'DB-REVIEW',`QID:1, found ${dbReviews.length} reviews`);
    
    return dbReviews;
}

// Read all reviews of a single user
export async function queryReadReviewsForUser(username:string): Promise<WithoutId<Review>[]> {
    
    const filter:Filter<Review> = {
        'username':{ $eq: username }
    };

    const findOptions:FindOptions<Review> = {
        projection: { username: 0 }
    };

    const dbReviews:WithoutId<Review>[] = await DB
        .collection<Review>(REVIEW_COLLECTION)
        .find(filter,findOptions)
        .toArray();

    // REVIEW_CACHE.pushAll(dbReviews);

    log(2,'DB-REVIEW',`QID:2, found ${dbReviews.length} reviews`);

    return dbReviews;
}

// REQUIRES: no review 'r' exists such that compareReview(newReview,r) is true
// Create Review in db
export async function queryCreateReview(newReview:Review) {
    
    await DB
        .collection<Review>(REVIEW_COLLECTION)
        .insertOne(newReview);

    // REVIEW_CACHE.push(newReview);
    
    log(2,'DB-REVIEW',`QID:3, Created new review`);
}

// REQURES: review 'r' exists such that compareReview(updatedReview,r) is true
// Updates review
export async function queryUpdateReview(updatedReview: Review) {
    
    const filter:Filter<Review> = {
        'username': {$eq: updatedReview.username},
        'productId': {$eq: updatedReview.productId}
    }

    await DB
        .collection<Review>(REVIEW_COLLECTION)
        .updateOne(filter,updatedReview);
    
    // REVIEW_CACHE.update(updatedReview);

    log(2,'DB-REVIEW',`QID:4, Updated a review`);   
}

// REQURES: review 'r' exists such that compareReview(updatedReview,r) is true
// Deletes review
export async function queryDeleteReview(username:string,productId:number) {
    
    const filter:Filter<Review> = {
        'username': {$eq: username},
        'productId': {$eq: productId}
    }

    await  DB
        .collection<Review>(REVIEW_COLLECTION)
        .deleteOne(filter);
    
    // REVIEW_CACHE.pop(generateReviewWithUsernameAndProductId(username,productId));

    log(2,'DB-REVIEW',`QID:5, Deleted a review`);
}

// Returns true if such a review exists
export async function queryReviewExists(username:string,productId:number):Promise<boolean> {

    const filter:Filter<Review> = {
        'username': {$eq: username},
        'productId': {$eq: productId}
    }

    const review = await DB
        .collection<Review>(REVIEW_COLLECTION)
        .findOne(filter);
    
    return (review != null);
}
