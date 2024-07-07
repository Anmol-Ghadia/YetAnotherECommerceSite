import { Db, Filter, FindOptions, WithoutId } from "mongodb";
import { Review } from "../schema";
import { log } from "../../logger";

let REVIEW_COLLECTION:string;
let DB: Db;

export function initializeReviewQueries(REVIEW_COLLECTION_NAME:string, givenDB:Db) {
    REVIEW_COLLECTION = REVIEW_COLLECTION_NAME;
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

    log(2,'DB-REVIEW',`QID:1, found (${dbReviews.length}) reviews for pID: (${productId})`);
    
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

    log(2,'DB-REVIEW',`QID:2, found (${dbReviews.length}) reviews for user: (${username})`);

    return dbReviews;
}

// REQUIRES: no review 'r' exists such that compareReview(newReview,r) is true
// Create Review in db
export async function queryCreateReview(newReview:Review):Promise<void> {
    
    DB
    .collection<Review>(REVIEW_COLLECTION)
    .insertOne(newReview)
    .then(()=>{
        
        log(2,'DB-REVIEW',`QID:3, Created new review by: (${newReview.username}) for (${newReview.productId})`);
    
    })
}

// REQURES: review 'r' exists such that compareReview(updatedReview,r) is true
// Updates review
export async function queryUpdateReview(updatedReview: Review): Promise<void> {
    
    const filter:Filter<Review> = {
        'username': {$eq: updatedReview.username},
        'productId': {$eq: updatedReview.productId}
    }

    DB
    .collection<Review>(REVIEW_COLLECTION)
    .updateOne(filter,updatedReview)
    .then(()=>{
        
        log(2,'DB-REVIEW',`QID:4, Updated a review by: (${updatedReview.username}) for (${updatedReview.productId})`);   
    });
}

// REQURES: review 'r' exists such that compareReview(updatedReview,r) is true
// Deletes review
export async function queryDeleteReview(username:string,productId:number): Promise<void> {
    
    const filter:Filter<Review> = {
        'username': {$eq: username},
        'productId': {$eq: productId}
    }

    DB
    .collection<Review>(REVIEW_COLLECTION)
    .deleteOne(filter)
    .then(()=>{
        
        log(2,'DB-REVIEW',`QID:5, Deleted a review by: (${username}) for (${productId})`);

    });
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
    
    log(2,'DB-REVIEW',`QID:6, Checked if review exists by: (${username}) for (${productId})`);
    return (review != null);
}

// REQURES: review 'r' exists such that compareReview(updatedReview,r) is true
// Deletes all reviews by the user
export async function queryDeleteReviewsByUser(username:string): Promise<void> {
    
    const filter:Filter<Review> = {
        'username': {$eq: username}
    }

    DB
    .collection<Review>(REVIEW_COLLECTION)
    .deleteOne(filter)
    .then(()=>{
        
        log(2,'DB-REVIEW',`QID:7, Deleted all reviews by user: (${username})`);

    });
}

// REQURES: review 'r' exists such that compareReview(updatedReview,r) is true
// Deletes all reviews of a product
export async function queryDeleteReviewsByProduct(productId:number): Promise<void> {
    
    const filter:Filter<Review> = {
        'productId': {$eq: productId}
    }

    DB
    .collection<Review>(REVIEW_COLLECTION)
    .deleteOne(filter)
    .then(()=>{
        
        log(2,'DB-REVIEW',`QID:8, Deleted all reviews for product: (${productId})`);

    });
}
