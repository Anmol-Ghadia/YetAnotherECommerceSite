import dotenv from 'dotenv';
import { 
    Db, MongoClient, WithId,
    ServerApiVersion,
    FindOptions, Filter,
    UpdateFilter
} from 'mongodb';
import {
    User,CartItem,
    Product,Review,
    cartItemProduct,
    compareProduct,
    generateProductWithId,
    compareUser,
    generateUserWithUsername,
    compareCartItem,
} from './database/schema';
import { log } from './logger';
import Cache from './database/cache';
import { initializeProductQueries } from './database/queries/productQueries';
import { initializeReviewQueries } from './database/queries/reviewQueries';
import { initializeCartQueries } from './database/queries/cartQueries';
import { initializeUserQueries } from './database/queries/userQueries';

// Globals
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

// Helpers
const removeObjectID:FindOptions<Product> = {
    projection: { _id: 0 }
};

// Returns true upon successfull connection to database
export function doDBConnect():boolean {
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
        
        // Initialize helper files
        initializeCartQueries(CART_COLLECTION,CART_CACHE,DB);
        initializeProductQueries(PRODUCT_COLLECTION,PRODUCT_CACHE,DB);
        initializeReviewQueries(REVIEW_COLLECTION,DB);
        initializeUserQueries(USER_COLLECTION,USER_CACHE,DB);

        pingDB();
        return true;
    } catch (err) {
        doDBClose();
        return false;
    }
}

// Closes database connection
export async function doDBClose() {
    await CLIENT.close();
}

// Pings the DB and prints the message
export async function pingDB() {
    await DB.command({ ping: 1 });
    log(1,'DATABASE','Pinged your deployment. You are currently connected to MongoDB!');
}

// get all reviews for a specific product
export async function getReviewsByProduct(productId:number) {
    const query= {
        'productId': { $eq: productId }
    };
    const filter:FindOptions<Product> = {
        projection: { _id: 0, productId: 0 }
    };
    const filteredDocs = await DB.collection<Review>(REVIEW_COLLECTION).find(query,filter).toArray();
    log(1,'DATABASE','DB Query QID:15');
    log(1,'DATABASE',`found ${filteredDocs.length} documents`);
    return filteredDocs;
}

// get review summary for a specific product
export async function getReviewStats(productId:number) {
    const query= {
        'productId': { $eq: productId }
    };
    const filter:FindOptions<Product> = {
        projection: { rating: 1 }
    };
    const filteredDocs = await DB.collection<Review>(REVIEW_COLLECTION).find(query,filter).toArray();
    log(1,'DATABASE','DB Query QID:16');
    log(1,'DATABASE',`found ${filteredDocs.length} documents`);
    return filteredDocs;
}

// Ignores max price if it is 0
export async function getRandomProductsWithSearch(search:string, minPrice: number, maxPrice:number, quantity: number) {
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
    const filteredDocs = await DB.collection<Product>(PRODUCT_COLLECTION).find(filter).limit(quantity).toArray();
    PRODUCT_CACHE.pushAll(filteredDocs);
    log(1,'DATABASE','DB Query QID:50');
    log(1,'DATABASE',`found ${filteredDocs.length} documents`);
    return filteredDocs;
}

// Returns random set of products, that fall under the specification
//   ignores maxPrice if it is 0
export async function getRandomProducts(minPrice: number, maxPrice:number,qunatity:number) {
    let filter: Filter<Product>;
    if (maxPrice==0) {
        filter = {
            'price' : { $gte: minPrice }
        }
    } else {
        filter = {
            'price' : { $gte: minPrice, $lte : maxPrice }
        }
    }
    const pipeline = [
        { $match: filter },
        { $sample: { size: qunatity } }
    ];
    const filteredDocs = await DB.collection<Product>(PRODUCT_COLLECTION).aggregate<Product>(pipeline).toArray();
    PRODUCT_CACHE.pushAll(filteredDocs);
    log(1,'DATABASE','DB Query QID:41');
    log(1,'DATABASE',`found ${filteredDocs.length} documents`);
    return filteredDocs;
}

// Returns the user's first and last name
export async function getUserFirstLastName(username:string) {
    const query= {
        'username': { $eq: username }
    };
    const filter:FindOptions<User> = {
        projection: { _id: 0, firstName: 1, lastName: 1 }
    };
    let filteredDocs;
    if (USER_CACHE.has(generateUserWithUsername(username))) {
        filteredDocs = USER_CACHE.get(generateUserWithUsername(username));
        log(1,'CACHE','cache has user for QID: 40');
    } else {
        filteredDocs = await DB.collection<User>(USER_COLLECTION)
                                    .findOne(query,filter);
        if (filteredDocs != null) USER_CACHE.push(filteredDocs);
        log(1,'DATABASE','DB Query QID: 40');
    }
    return filteredDocs
}

// Returns all reviews written by a user
export async function getUserReviews(username:string) {
    const query = {'username':{ $eq: username }};
    const filter:FindOptions<CartItem>={projection: { _id: 0, username: 0 } };
    const filteredDocs = await DB.collection<Review>(REVIEW_COLLECTION)
                            .find(query,filter).toArray();
    log(1,'DATABASE','DB Query QID:30');
    log(1,'DATABASE',`found ${filteredDocs.length} documents`);
    return filteredDocs;
}

export async function isOwnerOfProduct(productId: number, username: string): Promise<boolean> {
    const prod = await getProductByID(productId);
    if (prod == null) return false;
    if (prod.username == null) return false;
    return prod.username === username;
}

// gets the document with given product id
export async function getProductByID(id: number): Promise<WithId<Product> | Product | null> {
    const query= {
        'productId': { $eq: id }
    };
    
    let filteredDocs;
    if (PRODUCT_CACHE.has(generateProductWithId(id))) {
        filteredDocs = PRODUCT_CACHE.get(generateProductWithId(id));
        log(1,'CACHE','cache has product for QID:1');
    } else {
        filteredDocs = await DB.collection<Product>(PRODUCT_COLLECTION).findOne(query,removeObjectID );
        if (filteredDocs != null) PRODUCT_CACHE.push(filteredDocs);
        log(1,'DATABASE','DB Query QID:1');
    }
    log(1,'DATABASE',`found ${filteredDocs==null? '0':'1'} documents`);    
    return filteredDocs;
}

// gets the document with given id range, inclusive of both
export async function getProductByIDRange(startId: number,endId:number): Promise<WithId<Product>[] | null> {
    const query={ 'productId': { $gte: startId, $lte:endId } };
    const filteredDocs = await DB.collection<Product>(PRODUCT_COLLECTION).find(query, removeObjectID).toArray();
    PRODUCT_CACHE.pushAll(filteredDocs);
    log(1,'DATABASE',`found ${filteredDocs.length} documents`);
    log(1,'DATABASE','DB Query  QID:2');
    return filteredDocs;
}

// Returns products that satisfy the parameters
//    qty: max number of items to return
//    minPrice: minimum price of each item
//    maxPrice: maximum price of each item
//  Note: Omits maxPrice if 0
// TODO !!! sort and return a limited result. add upperbound on returned documents
export async function getProductQuery(qty:number,minPrice:number,maxPrice:number): Promise<WithId<Product>[]> {
    let query;
    if (maxPrice==0) {
        query = { 'price': { $gte:minPrice } };
    } else {
        query={ 'price': { $gte:minPrice, $lte:maxPrice } };
    }
    const options: FindOptions = {
        limit: qty,
        projection: {
            _id: 0
        }
    };
    
    const filteredDocs = await DB.collection<Product>(PRODUCT_COLLECTION).find(query,options).toArray();
    PRODUCT_CACHE.pushAll(filteredDocs);
    log(1,'DATABASE','DB Query  QID:6');
    return filteredDocs as WithId<Product>[];
}



// Returns all cart items of the given user
// Along with proudct details
export async function getUserCart(username:string) {
    const cartQuery={ 'username': { $eq:username }};
    const cartFilter:FindOptions<CartItem>={projection: { _id: 0, username: 0 } };
    const cartFilteredDocs = await DB.collection<CartItem>(CART_COLLECTION).find(cartQuery,cartFilter).toArray();
    const cartItemsWithDetails: cartItemProduct[] = [];
    for (let index = 0; index < cartFilteredDocs.length; index++) {
        const cartItem = cartFilteredDocs[index];
        
        const product = await getProductByID(cartItem.productId);
        if (product == null) {
            continue;
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
    }

    log(1,'DATABASE','DB Query  QID:15');
    return cartItemsWithDetails;
}

// Returns the specific cart item associated with the given username and product id
export async function getUserCartForProduct(username:string,productId:number) {
    const query={ 'username': { $eq:username }, 'productId': { $eq:productId } };
    const filter:FindOptions<CartItem>={projection: { _id: 0, quantity: 1 } };
    const filteredDocs = await DB.collection(CART_COLLECTION).findOne(query,filter);
    log(1,'DATABASE','DB Query  QID:16');
    return filteredDocs;
}

// Deletes the product listing
export async function removeProduct(productId: number) {
    const filter:Filter<Product> = { 
        'productId': { $eq:productId }
    };

    log(1,'DATABASE','DB Query QID:22');
    log(1,'DATABASE',`deleted product with id (${productId})`);
    
    PRODUCT_CACHE.pop(generateProductWithId(productId));
    await DB.collection<Product>(PRODUCT_COLLECTION)
                .deleteOne(filter);
}

// Deletes all cart items with the give product Id
export async function removeCartItemsByProductId(productId: number) {
    const filter: Filter<CartItem> = {
        'productId': { $eq : productId }
    }
    const out = await DB.collection<CartItem>(CART_COLLECTION).deleteMany(filter);
    log(1,'DATABASE',`deleted all carts with product Id: ${productId}, output=${out}`);
}

// updates user's cart for the product with given quantity
export async function updateUserCart(username:string,productId:number,quantity:number) {
    const currentCartItem = await getUserCartForProduct(username,productId);
    log(1,'DATABASE','DB Query QID:17');
    if (quantity == 0 && currentCartItem == null) {
        // No changes needed
        return;
    }
    if (quantity == 0) {
        // Delete existing
        const filter:Filter<CartItem> = { 
            'username': { $eq:username },
            'productId': { $eq:productId }
        };

        await DB.collection<CartItem>(CART_COLLECTION)
                    .deleteOne(filter);
    }
    if (currentCartItem == null) {
        // Add new entry
        const document:CartItem = {
            username: username,
            productId: productId,
            quantity: quantity
        }
        await DB.collection(CART_COLLECTION).insertOne(document);
        return;
    }
    // Update existing
    const filter:Filter<CartItem> = { 
        'username': { $eq:username },
        'productId': { $eq:productId }
    };
    const updateDoc:UpdateFilter<CartItem> = {
        $set: {
            quantity: quantity,
        }
    };

    await DB.collection<CartItem>(CART_COLLECTION)
                .updateOne(filter, updateDoc);
}

// Returns true if the given username exists in the database
export async function userExists(testUsername:string) :Promise<boolean> {
    const query={'username': {$eq:testUsername}};
    
    let exists;
    if (USER_CACHE.has(generateUserWithUsername(testUsername))) {
        exists = true;
        log(1,'CACHE','cache has user for QID:100');
    } else {
        exists = await DB.collection(USER_COLLECTION).find(query).hasNext();
        log(1,'DATABASE','DB Query QID:100');
    }
    return exists;
}

// Returns user document if the given username exists in the database
export async function getUserDetails(username:string) : Promise<User | null> {
    const query={'username': {$eq:username}};
    const filter:FindOptions<Product> = {
        projection: { _id: 0, hash: 0 }
    };
    let user;
    if (USER_CACHE.has(generateUserWithUsername(username))) {
        user = USER_CACHE.get(generateUserWithUsername(username));
        log(1,'CACHE','cache has User for QID:3');
    } else {
        user = await DB.collection<User>(USER_COLLECTION).findOne(query,filter);
        if (user != null) USER_CACHE.push(user);
        log(1,'DATABASE','DB Query QID:3');
    }
    return user;
}

export async function deleteReview(username:string,productId:number) {
    const filter:Filter<Review> = {
        'username': {$eq: username},
        'productId': {$eq: productId}
    }
    const out = await  DB.collection<Review>(REVIEW_COLLECTION).deleteOne(filter);
    log(1,'DATABASE',`deleted review, output is (${out})`);
}

export async function reviewExists(username:string,productId:number) {
    const filter:Filter<Review> = {
        'username': {$eq: username},
        'productId': {$eq: productId}
    }
    const document = await DB.collection<Review>(REVIEW_COLLECTION).findOne(filter);
    if (document == null) return false;
    return true;
}

export async function createReview(title:string,description:string,rating:number,
    username:string,productId:number) {
    
    const document:Review = {
        title: title,
        description: description,
        rating: rating,
        username: username,
        productId: productId
    }
    log(1,'DATABASE','DB Query QID:35');
    log(1,'DATABASE',`created new review by user (${username}) for product id (${productId})`);
    await DB.collection<Review>(REVIEW_COLLECTION).insertOne(document);
}

// Adds a new product listing
export async function makeProductListing(username: string, name: string,
        description:string, price: number, images: string[]) {

    const maxProductIdDoc = await DB.collection<Product>(PRODUCT_COLLECTION)
                                    .find().sort({ productId: -1 })
                                    .limit(1).next();
    let productId = 0;
    if (maxProductIdDoc != null) productId = maxProductIdDoc.productId +1;
    const document:Product = {
        productId: productId,
        username: username,
        name:name,
        description:description,
        price:price,
        images:images
    }
    log(1,'DATABASE','DB Query QID:20');
    log(1,'DATABASE',`created new product with id (${productId})`);
    log(1,'DATABASE',`adding to cache id:${productId}`);
    PRODUCT_CACHE.push(document);
    await DB.collection<Product>(PRODUCT_COLLECTION).insertOne(document);
}

// Adds a new product listing
export async function updateProductListing(productId: number, username: string,
        name: string, description:string, price: number, images: string[]) {

    const filter: Filter<Product> = {
        'productId' : { $eq: productId}
    }
    await DB.collection<Product>(PRODUCT_COLLECTION).deleteOne(filter);
    const document:Product = {
        productId: productId,
        username: username,
        name:name,
        description:description,
        price:price,
        images:images
    }
    log(1,'DATABASE','DB Query QID:21');
    log(1,'DATABASE',`updated product with id (${productId})`);
    PRODUCT_CACHE.pop(generateProductWithId(productId));
    log(1,'DATABASE',`adding to cache id:${productId}`);
    PRODUCT_CACHE.push(document);
    await DB.collection<Product>(PRODUCT_COLLECTION).insertOne(document);
}
// deletes a user from the database
export async function deleteUser(username: string) {
    const filter: Filter<User> = { username: username };
    USER_CACHE.pop(generateUserWithUsername(username));
    await DB.collection<User>(USER_COLLECTION).deleteOne(filter);
}

// deletes all information related to a user except the user itself
export async function deleteUserDetails(username: string) {
    // Delete all products of this user
    const filterProduct: Filter<Product> = {username:{$eq:username}}
    const products = await DB.collection<Product>(PRODUCT_COLLECTION).find(filterProduct).toArray();
    for (let index = 0; index < products.length; index++) {
        const productId = products[index].productId;
        await removeCartItemsByProductId(productId);
        await removeProduct(productId);
    }
    // Delete all reviews by this user
    const filterReview: Filter<Review> = {username: {$eq:username}}
    await DB.collection<Review>(REVIEW_COLLECTION).deleteMany(filterReview);
    // Delete cartitems of this user
    const filterCartItem: Filter<CartItem> = {username: {$eq:username}}
    await DB.collection<CartItem>(CART_COLLECTION).deleteMany(filterCartItem);
    log(1,'DATABASE',`deleted all details of username (${username})s`);
}

export async function updateReview(username:string,productId:number,title:string,description:string,rating:number) {
    const filter:Filter<Review> = {
        'username': {$eq: username},
        'productId': {$eq: productId}
    }
    await DB.collection<Review>(REVIEW_COLLECTION).deleteOne(filter);
    const updatedReview:Review = {
        title: title,
        description: description,
        rating: rating,
        username: username,
        productId: productId
    }
    await DB.collection<Review>(REVIEW_COLLECTION).replaceOne(filter,updatedReview);
    log(1,'DATABASE',`updated review for {username:(${username}),product:(${productId})`);
    log(1,'DATABASE','DB Query QID:51');
}

// Updates a user with the given details
export async function updateUser(username:string,firstName:string,lastName:string,address:string,phone:number,email:string,profilePhoto:string) {
    const filter: Filter<User> = { username: username };

    const oldUser = await DB.collection<User>(USER_COLLECTION)
                    .findOne(filter);

    if (oldUser==null) {
        log(0,'DATABASE','dbError 1');
        return;
    }
    await deleteUser(username);
    const newUser: User = {
        username: username,
        hash: oldUser.hash,
        firstName: firstName,
        lastName: lastName,
        address: address,
        phone: phone,
        email: email,
        profilePhoto: profilePhoto
    } 
    log(1,'DATABASE','DB Query QID:30');
    log(1,'DATABASE',`updated user details for (${username})`);
    USER_CACHE.pop(generateUserWithUsername(username));
    USER_CACHE.push(newUser);
    await DB.collection<User>(USER_COLLECTION).insertOne(newUser);
}

// // OLD !!!
// // Saves the given username and hash in database
// // REQUIRES: username is not already in the database
// export async function saveUserAndHash(username: string, hash:string) {
//     const document:User = {
//         username:username,
//         hash:hash,
//         firstName: 'PlaceHolder !!!',
//         lastName: 'PlaceHolder !!!',
//         address: 'PlaceHolder !!!',
//         phone: 9876543210,
//         email: 'PlaceHolder !!!',
//         profilePhoto: 'URL HERE'

//     }
//     log(1,'DATABASE','DB Query QID:4');
//     await DB.collection(USER_COLLECTION).insertOne(document);
// }

// Saves the username and hash in database
// REQUIRES: username is not already in the database
export async function saveUser(user: User) {
    log(1,'DATABASE','DB Query QID:10');
    USER_CACHE.push(user);
    await DB.collection(USER_COLLECTION).insertOne(user);
}

// Returns the has corresponding to the given username
// REQUIRES: such a username exists in database
export async function getUserHash(username:string):Promise<string> {
    const query={'username': {$eq:username}};
    let document;
    if (USER_CACHE.has(generateUserWithUsername(username))) {
        document = USER_CACHE.get(generateUserWithUsername(username));
        log(1,'CACHE','cache has user for QID:5');
    } else {
        document = await DB.collection<User>(USER_COLLECTION).findOne(query,removeObjectID);
        if (document!= null) USER_CACHE.push(document);
        log(1,'DATABASE','DB Query QID:5');
    }
    return (document != null) ? document['hash'] : '';
}

export async function deleteAllUsers() {
    USER_CACHE.drop();
    await DB.collection(USER_COLLECTION).deleteMany();
}

export async function deleteAllProducts() {
    PRODUCT_CACHE.drop();
    await DB.collection(PRODUCT_COLLECTION).deleteMany();
}

export async function deleteAllReviews() {
    await DB.collection(REVIEW_COLLECTION).deleteMany();
}

export async function deleteAllCarts() {
    await DB.collection(CART_COLLECTION).deleteMany();
}
