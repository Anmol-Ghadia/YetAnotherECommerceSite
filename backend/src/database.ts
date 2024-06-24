export {
    doDBConnect,
    getProductByID,
    doDBClose,
    Product,
    getProductByIDRange,
    userExists,
    saveUserAndHash,
    getUserHash,
    getProductQuery,
    getUserCartForProduct
};
import { 
    Collection, 
    Db, 
    MongoClient,
    ServerApiVersion,
    WithId,
    FindOptions
} from "mongodb";
import {
    User,CartItem,Product,Review
} from './schema';
import dotenv from 'dotenv';
dotenv.config();

// Globals
let CLIENT:MongoClient;
let DB:Db;
let PRODUCT_COLLECTION: string;
let USER_COLLECTION: string;
let CART_COLLECTION: string;
let REVIEW_COLLECTION: string;

// Helpers
const removeObjectID:FindOptions<Product> = {
    projection: { _id: 0 }
};

// Returns true upon successfull connection to database
function doDBConnect():boolean {
    try {
        CLIENT = new MongoClient(
            process.env.DB_URI as string, {
            serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
            }
        });
        DB = CLIENT.db(process.env.DB_NAME as string);
        PRODUCT_COLLECTION = process.env.PRODUCT_COLLECTION_NAME as string;
        USER_COLLECTION = process.env.USER_COLLECTION_NAME as string;
        CART_COLLECTION = process.env.CART_COLLECTION_NAME as string;
        REVIEW_COLLECTION = process.env.REVIEW_COLLECTION_NAME as string;
        pingDB();
        return true;
    } catch (err) {
        doDBClose();
        return false;
    }
}

// Closes database connection
async function doDBClose() {
    await CLIENT.close();
}

// Pings the DB and prints the message
async function pingDB() {
    await DB.command({ ping: 1 });
    console.log("Pinged your deployment. You are currently connected to MongoDB!");
}

// gets the document with given product id
async function getProductByID(id: number): Promise<WithId<Product> | null> {
    let query= {
        "productId": { $eq: id }
    };
    
    const filteredDocs = await DB.collection<Product>(PRODUCT_COLLECTION).findOne(query,removeObjectID );
    console.log('DB Query at' + Date.now().toString() + " QID:1");
    console.log('Found ', filteredDocs==null? '0':'1' ,' documents');
    return filteredDocs;
}

// gets the document with given id range, inclusive of both
async function getProductByIDRange(startId: number,endId:number): Promise<WithId<Product>[] | null> {
    let query={ "productId": { $gte: startId, $lte:endId } };
    const filteredDocs = await DB.collection<Product>(PRODUCT_COLLECTION).find(query, removeObjectID).toArray();
    console.log('Found ', filteredDocs.length, ' documents');
    console.log('DB Query at' + Date.now().toString() + " QID:2");
    return filteredDocs;
}

// Returns products that satisfy the parameters
//    qty: max number of items to return
//    minPrice: minimum price of each item
//    maxPrice: maximum price of each item
//  Note: Omits maxPrice if 0
async function getProductQuery(qty:number,minPrice:number,maxPrice:number): Promise<WithId<Product>[]> {
    let query;
    if (maxPrice==0) {
        query = { "price": { $gte:minPrice } };
    } else {
        query={ "price": { $gte:minPrice, $lte:maxPrice } };
    }
    let options: FindOptions = {
        limit: qty,
        projection: {
            _id: 0
        }
    };
    const filteredDocs = await DB.collection(PRODUCT_COLLECTION).find(query,options).toArray();
    console.log('DB Query at' + Date.now().toString() + " QID:6");
    return filteredDocs as WithId<Product>[];
}

// Returns the specific cart item associated with the given username and product id
async function getUserCartForProduct(username:string,productId:number) {
    const query={ "username": { $eq:username }, "productId": { $eq:productId } };
    const filteredDocs = await DB.collection(CART_COLLECTION).findOne(query);
    console.log('DB Query at' + Date.now().toString() + " QID:7");
    return filteredDocs;
}

// Returns true if the given username exists in the database
async function userExists(testUsername:string) :Promise<boolean> {
    let query={'username': {$eq:testUsername}};
    let exists = await DB.collection(USER_COLLECTION).find(query).hasNext();
    console.log('DB Query at' + Date.now().toString() + " QID:3");
    return exists;
}

// Saves the given username and hash in database
// REQUIRES: username is not already in the database
async function saveUserAndHash(username: string, hash:string) {
    let document:User = {
        username:username,
        hash:hash,
        firstName: 'PlaceHolder !!!',
        lastName: 'PlaceHolder !!!',
        address: 'PlaceHolder !!!',
        phone: 9876543210,
        email: 'PlaceHolder !!!',
        profilePhoto: 'URL HERE'

    }
    console.log('DB Query at' + Date.now().toString() + " QID:4");
    await DB.collection(USER_COLLECTION).insertOne(document);
}

// Returns the has corresponding to the given username
// REQUIRES: such a username exists in database
async function getUserHash(username:string):Promise<string> {
    let query={'username': {$eq:username}};
    const document = await DB.collection(USER_COLLECTION).findOne(query);
    console.log('DB Query at' + Date.now().toString() + " QID:5");
    return (document != null) ? document['hash'] : '';
}
