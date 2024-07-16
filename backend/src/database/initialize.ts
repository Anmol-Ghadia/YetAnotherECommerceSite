import dotenv from 'dotenv';
import { 
    Db, MongoClient,
    ServerApiVersion
} from 'mongodb';
import Cache from './cache';
import { CartItem, compareCartItem, compareProduct, compareUser, Product, User } from './schema';
import { initializeCartQueries } from './queries/cartQueries';
import { initializeProductQueries } from './queries/productQueries';
import { initializeReviewQueries } from './queries/reviewQueries';
import { initializeUserQueries } from './queries/userQueries';
import { log } from '../logger';


dotenv.config();
let CLIENT:MongoClient;
let DB:Db;
let PRODUCT_COLLECTION: string;
let USER_COLLECTION: string;
let CART_COLLECTION: string;
let REVIEW_COLLECTION: string;
let PRODUCT_CACHE: Cache<Product>;
let CART_CACHE: Cache<CartItem>;
let USER_CACHE: Cache<User>;

// Returns true upon successfull connection to database
export async function doDBConnect():Promise<boolean> {
    try {
        CLIENT = new MongoClient(
            process.env.DB_URI as string, {
            serverApi: {
            version: ServerApiVersion.v1,
            strict: false,
            deprecationErrors: true,
            }
        });

        DB = CLIENT.db(process.env.DB_NAME as string);
        PRODUCT_COLLECTION = process.env.PRODUCT_COLLECTION_NAME as string;
        USER_COLLECTION = process.env.USER_COLLECTION_NAME as string;
        CART_COLLECTION = process.env.CART_COLLECTION_NAME as string;
        REVIEW_COLLECTION = process.env.REVIEW_COLLECTION_NAME as string;

        // CACHES
        PRODUCT_CACHE = new Cache(compareProduct);
        CART_CACHE  = new Cache(compareCartItem);
        USER_CACHE  = new Cache(compareUser);
        
        // Initialize sub-query files
        initializeCartQueries(CART_COLLECTION,CART_CACHE,DB);
        initializeProductQueries(PRODUCT_COLLECTION,PRODUCT_CACHE,DB);
        initializeReviewQueries(REVIEW_COLLECTION,DB);
        initializeUserQueries(USER_COLLECTION,USER_CACHE,DB);

        await pingDB();
        return true;
    } catch (err) {
        await doDBClose();
        return false;
    }
}

// Closes database connection
export async function doDBClose() {
    if (CLIENT != null) await CLIENT.close();
}

// Pings the DB and prints the message
export async function pingDB() {
    await DB.command({ ping: 1 });
    log(1,'DATABASE','Pinged your deployment. You are currently connected to MongoDB!');
}
