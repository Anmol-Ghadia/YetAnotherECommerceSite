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

let CLIENT:MongoClient;
let DB:Db;
let PRODUCT_COLLECTION:Collection<Product>;
let USER_COLLECTION:Collection<User>;

interface User {
    username:string,
    hash:string
}

interface Product {
    _id: ObjectId;
    ProdId: number;
    Name: string;
    Description: string;
    price: number;
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
        PRODUCT_COLLECTION = DB.collection<Product>(process.env.PRODUCT_COLLECTION_NAME as string);
        USER_COLLECTION = DB.collection<User>(process.env.PRODUCT_COLLECTION_NAME as string);
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
        "ProdId": { $eq: id }
    };
    let filter:FindOptions<Product> = {
        projection: { _id: 0 }
    };
    const filteredDocs = await PRODUCT_COLLECTION.findOne(query,filter );
    console.log('Found documents filtered by'+JSON.stringify(query) +' =>', filteredDocs);
    return filteredDocs;
}

// Pings the DB and prints the message
async function pingDB() {
    await DB.command({ ping: 1 });
    console.log("Pinged your deployment. You are currently connected to MongoDB!");
}

// gets the document with given id range, inclusive of both
async function getProductByIDRange(startId: number,endId:number): Promise<WithId<Product>[]> {
    let query={ "ProdId": { $gte: startId, $lte:endId } };
    const filteredDocs = await PRODUCT_COLLECTION.find(query,{ projection: { _id: 0 } }).toArray();
    console.log('Found documents filtered by'+JSON.stringify(query) +' =>', filteredDocs);
    return filteredDocs;
}

// Returns true if the given username exists in the database
async function userExists(testUsername:string) :Promise<boolean> {
    let query={'username': {$eq:testUsername}};
    let exists = await USER_COLLECTION.find(query).hasNext();
    return exists;
}

// Saves the given username and hash in database
// REQUIRES: username is not already in the database
async function saveUserAndHash(username: string, hash:string) {
    let document:User = {
        'username':username,
        'hash':hash
    }
    await USER_COLLECTION.insertOne(document);
}

// Returns the has corresponding to the given username
// REQUIRES: such a username exists in database
async function getUserHash(username:string):Promise<string> {
    let query={'username': {$eq:username}};
    const document = await USER_COLLECTION.findOne(query);
    return (document != null) ? document['hash'] : '';
}
