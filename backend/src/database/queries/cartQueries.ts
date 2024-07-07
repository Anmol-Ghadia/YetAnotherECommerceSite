import { 
    Db, Filter, FindOptions,
    WithoutId
} from 'mongodb';
import { CartItem, cartItemProduct, generateCartItemWithUsernameAndProductId } from '../schema';
import { log } from '../../logger';
import { queryReadProductById } from './productQueries';
import Cache from '../cache';

let CART_COLLECTION:string;
let CART_CACHE: Cache<CartItem>;
let DB: Db;

export function initializeCartQueries(CART_COLLECTION_NAME:string, givenCART_CACHE: Cache<CartItem>, givenDB:Db) {
    CART_COLLECTION = CART_COLLECTION_NAME;
    CART_CACHE = givenCART_CACHE;
    DB = givenDB;
}

// Reads a cartItem document from the database
export async function queryGetSingleCartItem(username: string, productId: number): Promise<WithoutId<CartItem> | null> {

    if (CART_CACHE.has(generateCartItemWithUsernameAndProductId(username,productId))) {
        log(2,'CACHE-CART',`QID:1, Got hit for cart Item of: (${username}) for (${productId})`);
        return CART_CACHE.get(generateCartItemWithUsernameAndProductId(username,productId));
    }

    const filter:Filter<CartItem> = {
        'username': { $eq:username },
        'productId': { $eq:productId }
    };

    const options:FindOptions<CartItem>={
        projection: {
            quantity: 1
        }
    };

    const filteredDocs:WithoutId<CartItem>|null = await DB
        .collection<CartItem>(CART_COLLECTION)
        .findOne(filter,options);
    
    if (filteredDocs!=null) CART_CACHE.push(filteredDocs);

    log(2,'DB-CART',`QID:1, Read single cart item of: (${username}) for (${productId})`);
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

    const updatedCartItem:CartItem = {
        username: username,
        productId: productId,
        quantity: newQuantity,
    };

    DB
    .collection<CartItem>(CART_COLLECTION)
    .updateOne(filter, updatedCartItem)
    .then(()=>{
        CART_CACHE.update(updatedCartItem)
        log(2,'DB-CART',`QID:2, Updated single cart item of: (${username}) for (${productId})`);
    })
}

// Returns all cart items of a single user, with product details
export async function queryReadCartByUser(username:string):Promise<WithoutId<cartItemProduct>[]> {

    const filter:Filter<CartItem> = {
        'username' : { $eq:username }
    };

    const findOptions:FindOptions<CartItem> = {
        projection: { username: 0 }
    };

    const dbCartItems:WithoutId<CartItem>[] = await DB
        .collection<CartItem>(CART_COLLECTION)
        .find(filter,findOptions)
        .toArray();
    
    CART_CACHE.pushAll(dbCartItems);

    const cartItemsWithDetails: cartItemProduct[] = [];
    dbCartItems.forEach(async (cartItem)=>{
        const product = await queryReadProductById(cartItem.productId);
        if (product == null) {
            log(1,'DB-CART',`QID:3, Found non-existing product id:(${cartItem.productId}) in user: (${username})'s cart`);
            return;
        }

        const newItem:cartItemProduct = {
            productId: product.productId,
            name: product.name,
            description: product.description,
            price: product.price,
            images: product.images,
            quantity: cartItem.quantity
        }

        cartItemsWithDetails.push(newItem);
    })

    log(2,'DB-CART',`QID:3, Read products in user: (${username})'s cart`);
    return cartItemsWithDetails;
}

// ===== HELPERS =====

// Creates a new cartItem document in the database
async function queryCreateSingleCartItem(username: string,productId:number,newQuantity:number):Promise<void> {
    
    const newDocument:CartItem = {
        username: username,
        productId: productId,
        quantity: newQuantity
    }

    await DB
        .collection<CartItem>(CART_COLLECTION)
        .insertOne(newDocument);

    CART_CACHE.push(newDocument);

    log(2,`DB-CART`,`QID:100, Created single cart item for: (${username}) of (${productId}), qty:(${newQuantity})`);
}

// Deletes a cartItem document from the database
async function queryDeleteSingleCartItem(username: string,productId:number):Promise<void> {
    
    const filter:Filter<CartItem> = { 
        'username': { $eq:username },
        'productId': { $eq:productId }
    };

    await DB
        .collection<CartItem>(CART_COLLECTION)
        .deleteOne(filter);

    CART_CACHE.pop(generateCartItemWithUsernameAndProductId(username,productId));

    log(2,`DB-CART`,`QID:101, Deleted single cart item for: (${username}) of (${productId})`);
}

// Deletes all cartItems for a user
export async function queryDeleteCartItemByUser(username: string):Promise<void> {
    
    const filter:Filter<CartItem> = { 
        'username': { $eq:username }
    };

    DB
    .collection<CartItem>(CART_COLLECTION)
    .deleteOne(filter)
    .then(()=>{
        CART_CACHE.drop();
        log(2,`DB-CART`,`QID:102, Deleted cart items for user: (${username})`);
    })
}

// Deletes all cartItems for the given product
export async function queryDeleteCartItemByProduct(productId:number):Promise<void> {
    
    const filter:Filter<CartItem> = {
        'productId': { $eq:productId }
    };

    DB
    .collection<CartItem>(CART_COLLECTION)
    .deleteOne(filter)
    .then(()=>{
        CART_CACHE.drop();
        log(2,`DB-CART`,`QID:103, Deleted cart items with product: (${productId})`);
    })
}
