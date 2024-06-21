export {
    doDBConnect,
    getProductByID,
    doDBClose,
    Product,
    getProductByIDRange,
    userExists,
    saveUserAndHash,
    getUserHash
};
import { 
    Collection, 
    Db, 
    MongoClient,
    ServerApiVersion,
    Document,
    WithId,
    ObjectId,
    FindOptions
} from "mongodb";

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

interface User {
    username:string,
    hash:string,
    firstName: string,
    lastName: string,
    address: string,
    phone: number,
    email: string
}

interface Cart {
    username: string,
    productId: number,
    quantity: number
}

interface Product {
    productId: number;
    name: string;
    description: string;
    price: number;
    images: string[]
}

interface Review {
    reviewId: number,
    title: string,
    description: string,
    rating: number
    username: string,
    productId: number
}

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

// gets the document with given product id
async function getProductByID(id: number): Promise<WithId<Product> | null> {
    let query= {
        "productId": { $eq: id }
    };
    
    const filteredDocs = await DB.collection(PRODUCT_COLLECTION).findOne(query,removeObjectID );
    console.log('DB Query at' + Date.now().toString() + " QID:1");
    // console.log('Found documents filtered by'+JSON.stringify(query) +' =>', filteredDocs);
    return filteredDocs as WithId<Product>;
}

// Pings the DB and prints the message
async function pingDB() {
    await DB.command({ ping: 1 });
    console.log("Pinged your deployment. You are currently connected to MongoDB!");
}

// gets the document with given id range, inclusive of both
async function getProductByIDRange(startId: number,endId:number): Promise<WithId<Product>[]> {
    let query={ "productId": { $gte: startId, $lte:endId } };
    const filteredDocs = await DB.collection(PRODUCT_COLLECTION).find(query, removeObjectID).toArray();
    // console.log('Found documents filtered by'+JSON.stringify(query) +' =>', filteredDocs);
    console.log('DB Query at' + Date.now().toString() + " QID:2");
    return filteredDocs as WithId<Product>[];
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
        email: 'PlaceHolder !!!'

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
