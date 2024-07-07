import { 
    Db, Filter, FindOptions,
    UpdateFilter,
    WithoutId
} from 'mongodb';
import { CartItem } from '../schema';
import { log } from '../../logger';

let CART_COLLECTION:string;
let DB: Db;

export function initializeUserQueries(CART_COLLECTION_NAME:string, givenDB:Db) {
    CART_COLLECTION = CART_COLLECTION_NAME;
    DB = givenDB;
}

// Reads a cartItem document from the database
export async function queryGetSingleCartItem(username: string, productId: number): Promise<WithoutId<CartItem> | null> {
    const filter:Filter<CartItem> = {
        'username': { $eq:username },
        'productId': { $eq:productId }
    };

    const options:FindOptions<CartItem>={
        projection: {
            _id: 0,
            quantity: 1
        }
    };

    const filteredDocs:WithoutId<CartItem>|null = await DB.collection<CartItem>(CART_COLLECTION)
    .findOne(filter,options);
    
    log(2,'DB-USER',`QID:1, Read single cart item`);
    return filteredDocs;
}

// Updates a cartItem document in the database
export async function queryUpdateSingleCartItem(username:string,productId: number, newQuantity: number):Promise<void> {
    
    const currentCartItem = await queryGetSingleCartItem(username,productId);
    
    // No changes needed
    if (newQuantity == 0 && currentCartItem == null) {
        return;
    }

    // Does not exist, create new one
    if (currentCartItem == null) {
        await queryCreateSingleCartItem(username,productId,newQuantity);
        return;
    }

    // remove existing
    if (newQuantity == 0) {
        await queryDeleteSingleCartItem(username,productId);
        return;
    }

    // Update existing
    const filter:Filter<CartItem> = { 
        'username': { $eq:username },
        'productId': { $eq:productId }
    };

    const updateFilter:UpdateFilter<CartItem> = {
        $set: {
            quantity: newQuantity,
        }
    };

    await DB.collection<CartItem>(CART_COLLECTION)
    .updateOne(filter, updateFilter);

    log(2,'DB-USER','QID:2, Updated single cart item');
}

// ===== HELPERS =====

// Creates a new cartItem document in the database
async function queryCreateSingleCartItem(username: string,productId:number,newQuantity:number):Promise<void> {
    const newDocument:CartItem = {
        username: username,
        productId: productId,
        quantity: newQuantity
    }

    await DB.collection<CartItem>(CART_COLLECTION).insertOne(newDocument);

    log(2,`DB-USER`,`QID:100, Created single cart item`);
}

// Deletes a cartItem document from the database
async function queryDeleteSingleCartItem(username: string,productId:number):Promise<void> {
    const filter:Filter<CartItem> = { 
        'username': { $eq:username },
        'productId': { $eq:productId }
    };

    await DB.collection<CartItem>(CART_COLLECTION)
    .deleteOne(filter);

    log(2,`DB-USER`,`QID:101, Deleted single cart item`);
}
