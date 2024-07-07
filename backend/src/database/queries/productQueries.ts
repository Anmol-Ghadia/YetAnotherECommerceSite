import { Db, Filter, UpdateFilter, WithoutId } from "mongodb";
import { generateProductWithId, Product } from "../schema";
import Cache from "../cache";
import { log } from "../../logger";
import { queryDeleteCartItemByProduct } from "./cartQueries";
import { queryDeleteReviewsByProduct } from "./reviewQueries";

let PRODUCT_COLLECTION:string;
let PRODUCT_CACHE: Cache<Product>;
let DB: Db;

export function initializeProductQueries(PRODUCT_COLLECTION_NAME:string, givenPRODUCT_CACHE:Cache<Product>,givenDB:Db) {
    PRODUCT_COLLECTION = PRODUCT_COLLECTION_NAME;
    PRODUCT_CACHE = givenPRODUCT_CACHE
    DB = givenDB;
}

// Reads the product from database
export async function queryReadProductById(productId: number): Promise<WithoutId<Product> | null> {
    
    // Query the cache first
    if (PRODUCT_CACHE.has(generateProductWithId(productId))) {
        
        const cacheProduct = PRODUCT_CACHE.get(generateProductWithId(productId));

        log(2,'CACHE-PRODUCT',`QID:1, got a hit for product: (${productId})`);
        return cacheProduct;
    }

    const filter:Filter<Product> = {
        'productId': { $eq: productId }
    };

    const dbProduct:WithoutId<Product>|null = await DB
        .collection<Product>(PRODUCT_COLLECTION)
        .findOne(filter);

    // Update Cache
    if (dbProduct != null) PRODUCT_CACHE.push(dbProduct);
    log(2,'DB-PRODUCT',`QID:1, Read a product: (${productId})`);

    return dbProduct;
}

// gets the document with given id range, inclusive of both
export async function queryReadProductByIdRange(startId: number,endId:number): Promise<WithoutId<Product>[] | null> {
    
    const {missingIds,cacheProducts} = queryCachedProductsByIdRange(startId,endId);
    log(2,'DB-CACHE',`QID:2, got hits for (${cacheProducts.length}) products`);

    if (missingIds.length == 0) {
        return cacheProducts;
    }

    const filter:Filter<Product> = {
        'productId': { $in: missingIds }
    };

    const dbProducts:WithoutId<Product>[] = await DB
        .collection<Product>(PRODUCT_COLLECTION)
        .find(filter)
        .toArray();

    // Update Cache
    PRODUCT_CACHE.pushAll(dbProducts);
    
    log(2,'DB-PRODUCT',`QID:2, Read (${dbProducts.length}) documents`);

    return [...cacheProducts,...dbProducts];
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
    
    DB
    .collection<Product>(PRODUCT_COLLECTION)
    .insertOne(newProduct)
    .then(()=>{
        log(2,'DB-PRODUCT',`QID:3, Created a new product: (${productId})`);
    })

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

    DB
    .collection<Product>(PRODUCT_COLLECTION)
    .updateOne(filter,updateFilter)
    .then(()=>{
        log(2,'DB-PRODUCT',`QID:4, Updated a product: (${updatedProduct.productId})`);
    })
}

// REQUIRES: product 'p' exists such that 
//           compareProduct(generateProductWithId(productId),p) is true
// Delete a product
export async function queryDeleteProduct(productId: number):Promise<void> {
    
    const filter:Filter<Product> = { 
        'productId': { $eq:productId }
    };

    PRODUCT_CACHE.pop(generateProductWithId(productId));

    queryDeleteCartItemByProduct(productId);
    queryDeleteReviewsByProduct(productId);
    
    DB
    .collection<Product>(PRODUCT_COLLECTION)
    .deleteOne(filter)
    .then(()=>{
        log(2,'DB-PRODUCT',`QID:5, deleted a product: (${productId})`);
    })
}

// Returns true if owner of product
export async function queryOwnershipOfProduct(productId: number, username: string): Promise<boolean> {
    const prod = await queryReadProductById(productId);
    
    // base cases
    if (prod == null) return false;
    if (prod.username == null) return false;
    
    log(2,'DB-PRODUCT',`QID:6, tested ownership of product: (${productId}) for (${username})`);
    return (prod.username === username);

}

// Deletes all products created by this user
export async function queryDeleteProductsByUser(username:string) {
    const filter:Filter<Product> = { 
        'username': { $eq:username }
    };
    
    const products:WithoutId<Product>[] = await DB
        .collection<Product>(PRODUCT_COLLECTION)
        .find(filter)
        .toArray();
    
    products.forEach((product)=>{
        queryDeleteProduct(product.productId);
    })
    
    log(2,'DB-PRODUCT',`QID:7, Deleted all products by user: (${username})`);
}

// Returns random set of products, that fall under the specification
//   ignores maxPrice if it is 0
export async function queryReadRandomProducts(minPrice: number, maxPrice:number,qunatity:number): Promise<WithoutId<Product>[]> {
    const filter: Filter<Product> = {};

    if (maxPrice==0) {
        filter.price = { $gte: minPrice }
    } else {
        filter.price = { $gte: minPrice, $lte : maxPrice }
    }

    const pipeline = [
        { $match: filter },
        { $sample: { size: qunatity } }
    ];

    const filteredDocs = await DB
        .collection<Product>(PRODUCT_COLLECTION)
        .aggregate<Product>(pipeline)
        .toArray();
    
    PRODUCT_CACHE.pushAll(filteredDocs);
    
    log(2,'DB-PRODUCT',`QID:8, Read (${qunatity}) random products in price range ([${minPrice},${maxPrice}])`);
    return filteredDocs;
}

// Returns products that match the search string
//      Ignores max price if it is 0
export async function queryReadProductsBySearchString(search:string, minPrice: number, maxPrice:number, quantity: number): Promise<WithoutId<Product>[]> {
    
    let filter: Filter<Product>;
    if (maxPrice == 0) {
        filter = {
            $text: {$search:search},
            'price' : { $gte: minPrice }
        }
    } else {
        filter = {
            $text: {$search:search},
            'price' : { $gte: minPrice, $lte : maxPrice }
        }
    }

    // Execute search query
    const filteredDocs = await DB
        .collection<Product>(PRODUCT_COLLECTION)
        .find(filter)
        .limit(quantity)
        .toArray();

    PRODUCT_CACHE.pushAll(filteredDocs);

    log(2,'DB-PRODUCT',`QID:9, Read products based on Search string in price range ([${minPrice},${maxPrice}])`);

    return filteredDocs;
}

// !!! CAUTION !!!
// Delete a product
export async function queryDeleteAllProducts():Promise<void> {
    
    const filter:Filter<Product> = {};

    await DB
        .collection<Product>(PRODUCT_COLLECTION)
        .deleteOne(filter)

    log(1,'DB-PRODUCT',`QID:10, deleted all products`);
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
