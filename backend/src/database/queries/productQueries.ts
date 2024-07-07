import { Db, Filter, UpdateFilter, WithoutId } from "mongodb";
import { generateProductWithId, Product } from "../schema";
import Cache from "../cache";
import { log } from "../../logger";

let PRODUCT_COLLECTION:string;
let PRODUCT_CACHE: Cache<Product>;
let DB: Db;

export function initializeProductQueries(PRODUCT_COLLECTION_NAME:string, givenPRODUCT_CACHE:Cache<Product>,givenDB:Db) {
    PRODUCT_COLLECTION = PRODUCT_COLLECTION_NAME;
    PRODUCT_CACHE = givenPRODUCT_CACHE
    DB = givenDB;
}

// Reads the product from database
export async function queryReadProductById(id: number): Promise<WithoutId<Product> | null> {
    
    // Query the cache first
    if (PRODUCT_CACHE.has(generateProductWithId(id))) {
        
        const cacheProduct = PRODUCT_CACHE.get(generateProductWithId(id));

        log(2,'CACHE-PRODUCT','QID:1, got a hit for product');
        return cacheProduct;
    }

    const filter:Filter<Product> = {
        'productId': { $eq: id }
    };

    const dbProduct:WithoutId<Product>|null = await DB
        .collection<Product>(PRODUCT_COLLECTION)
        .findOne(filter);

    // Update Cache
    if (dbProduct != null) PRODUCT_CACHE.push(dbProduct);
    log(2,'DB-PRODUCT','QID:1, Read a product');

    return dbProduct;
}

// gets the document with given id range, inclusive of both
export async function queryReadProductByIdRange(startId: number,endId:number): Promise<WithoutId<Product>[] | null> {
    
    const {missingIds,cacheProducts} = queryCachedProductsByIdRange(startId,endId);
    log(2,'DB-CACHE',`QID:2, got hits for ${cacheProducts.length} products`);

    if (missingIds.length != 0) {
        const filter:Filter<Product> = {
            'productId': { $in: missingIds }
        };
    
        const dbProducts:WithoutId<Product>[] = await DB
            .collection<Product>(PRODUCT_COLLECTION)
            .find(filter)
            .toArray();
    
        // Update Cache
        PRODUCT_CACHE.pushAll(dbProducts);
        
        log(2,'DB-PRODUCT',`QID:2, Read ${dbProducts.length} documents`);

        return [...cacheProducts,...dbProducts];
    }

    return cacheProducts;
}

// Creates a new product
// Returns the generated product id
export async function queryCreateProduct(newProduct:Product):Promise<number> {

    const maxProductIdDoc = await DB
        .collection<Product>(PRODUCT_COLLECTION)
        .find()
        .sort({ productId: -1 })
        .limit(1)
        .next();

    // generate unique product id
    let productId = 999;
    if (maxProductIdDoc != null) productId = maxProductIdDoc.productId +1;
    newProduct.productId = productId;

    PRODUCT_CACHE.push(newProduct);
    
    await DB
        .collection<Product>(PRODUCT_COLLECTION)
        .insertOne(newProduct);

    log(2,'DB-PRODUCT',`QID:3, Created a new product`);
    return productId;
}

// REQUIRES: product 'p' exists such that compareProduct(updatedProduct,p) is true
// Updates a product listing
export async function queryUpdateProduct(updatedProduct:Product):Promise<void> {
    // Update cache
    PRODUCT_CACHE.update(updatedProduct);

    const filter: Filter<Product> = {
        'productId' : { $eq: updatedProduct.productId}
    }

    const updateFilter:UpdateFilter<Product> = {
        $set : {
            username: updatedProduct.username,
            name: updatedProduct.name,
            description: updatedProduct.description,
            price: updatedProduct.price,
            images: updatedProduct.images
        }
    };

    await DB
        .collection<Product>(PRODUCT_COLLECTION)
        .updateOne(filter,updateFilter);
        
    log(2,'DB-PRODUCT',`QID:4, Updated a product`);
}

// REQUIRES: product 'p' exists such that 
//           compareProduct(generateProductWithId(productId),p) is true
// Delete a product
export async function queryDeleteProduct(productId: number):Promise<void> {
    
    const filter:Filter<Product> = { 
        'productId': { $eq:productId }
    };

    PRODUCT_CACHE.pop(generateProductWithId(productId));

    await DB
        .collection<Product>(PRODUCT_COLLECTION)
        .deleteOne(filter);
        
    log(2,'DB-PRODUCT',`QID:5, deleted a product`);
}

// Returns true if owner of product
export async function queryOwnershipOfProduct(productId: number, username: string): Promise<boolean> {
    const prod = await queryReadProductById(productId);
    
    // base cases
    if (prod == null) return false;
    if (prod.username == null) return false;
    
    log(2,'DB-PRODUCT',`QID:6, tested ownership of a product`);
    return prod.username === username;
    
}

// ====== HELPERS ======

// returns the products that are cached in the given range with
//    missingIds: productIds which were missing in cache
//    cacheProducts: products as found in cache
function queryCachedProductsByIdRange(from:number,to:number) {
    const foundProducts:WithoutId<Product>[] = [];
    const notFoundIds:number[] = [];
    for (let id = from; id < to+1; id++) {
        if (PRODUCT_CACHE.has(generateProductWithId(id))) {
            foundProducts.push(PRODUCT_CACHE.get(generateProductWithId(id)));
        } else {
            notFoundIds.push(id);
        }
    }
    return {
        missingIds: notFoundIds,
        cacheProducts: foundProducts
    };
}
