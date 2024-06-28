import dotenv from 'dotenv';
import { 
    Db, MongoClient, WithId,
    ServerApiVersion,
    FindOptions, Filter,
    UpdateFilter
} from "mongodb";
import {
    User,CartItem,
    Product,Review
} from './schema';

// Globals
dotenv.config();
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
    console.log("Pinged your deployment. You are currently connected to MongoDB!");
}

// get all reviews for a specific product
export async function getReviewsByProduct(productId:number) {
    let query= {
        "productId": { $eq: productId }
    };
    const filter:FindOptions<Product> = {
        projection: { _id: 0, productId: 0 }
    };
    const filteredDocs = await DB.collection<Review>(REVIEW_COLLECTION).find(query,filter).toArray();
    console.log('DB Query at ' + Date.now().toString() + " QID:15");
    console.log('Found ', filteredDocs.length ,' documents');
    return filteredDocs;
}

// get review summary for a specific product
export async function getReviewStats(productId:number) {
    let query= {
        "productId": { $eq: productId }
    };
    const filter:FindOptions<Product> = {
        projection: { rating: 1 }
    };
    const filteredDocs = await DB.collection<Review>(REVIEW_COLLECTION).find(query,filter).toArray();
    console.log('DB Query at ' + Date.now().toString() + " QID:16");
    console.log('Found ', filteredDocs.length ,' documents');
    return filteredDocs;
}

export async function getRandomProductsWithSearch(search:string, minPrice: number, maxPrice:number, quantity: number) {
    const filter: Filter<Product> = {
        $text: {$search:search},
        "price" : { $gte: minPrice, $lte : maxPrice }
    }

    // Execute search query
    const filteredDocs = await DB.collection<Product>(PRODUCT_COLLECTION).find(filter).limit(quantity).toArray();
    console.log('DB Query at ' + Date.now().toString() + " QID:50");
    console.log('Found ', filteredDocs.length ,' documents');
    return filteredDocs;
}

// Returns random set of products, that fall under the specification
export async function getRandomProducts(minPrice: number, maxPrice:number,qunatity:number) {
    const filter: Filter<Product> = {
        "price" : { $gte: minPrice, $lte : maxPrice }
    }
    const pipeline = [
        { $match: filter },
        { $sample: { size: qunatity } }
    ];
    const filteredDocs = await DB.collection(PRODUCT_COLLECTION).aggregate(pipeline).toArray();
    console.log('DB Query at ' + Date.now().toString() + " QID:41");
    console.log('Found ', filteredDocs.length ,' documents');
    return filteredDocs;
}

// Returns the user's first and last name
export async function getUserFirstLastName(username:string) {
    let query= {
        "username": { $eq: username }
    };
    const filter:FindOptions<User> = {
        projection: { _id: 0, firstName: 1, lastName: 1 }
    };
    let filteredDocs = await DB.collection<User>(USER_COLLECTION)
                                .findOne(query,filter);
    console.log('DB Query at ' + Date.now().toString() + " QID: 40");
    return filteredDocs
}

// Returns all reviews written by a user
export async function getUserReviews(username:string) {
    let query = {"username":{ $eq: username }};
    const filter:FindOptions<CartItem>={projection: { _id: 0, username: 0 } };
    let filteredDocs = await DB.collection<Review>(REVIEW_COLLECTION)
                            .find(query,filter).toArray();
    console.log('DB Query at ' + Date.now().toString() + " QID:30");
    console.log('Found ', filteredDocs.length ,' documents');
    return filteredDocs;
}

export async function isOwnerOfProduct(productId: number, username: string): Promise<boolean> {
    let prod = await getProductByID(productId);
    if (prod == null) return false;
    if (prod.username == null) return false;
    return prod.username === username;
}

// gets the document with given product id
export async function getProductByID(id: number): Promise<WithId<Product> | null> {
    let query= {
        "productId": { $eq: id }
    };
    
    const filteredDocs = await DB.collection<Product>(PRODUCT_COLLECTION).findOne(query,removeObjectID );
    console.log('DB Query at ' + Date.now().toString() + " QID:1");
    console.log('Found ', filteredDocs==null? '0':'1' ,' documents');
    return filteredDocs;
}

// gets the document with given id range, inclusive of both
export async function getProductByIDRange(startId: number,endId:number): Promise<WithId<Product>[] | null> {
    let query={ "productId": { $gte: startId, $lte:endId } };
    const filteredDocs = await DB.collection<Product>(PRODUCT_COLLECTION).find(query, removeObjectID).toArray();
    console.log('Found ', filteredDocs.length, ' documents');
    console.log('DB Query at ' + Date.now().toString() + " QID:2");
    return filteredDocs;
}

// Returns products that satisfy the parameters
//    qty: max number of items to return
//    minPrice: minimum price of each item
//    maxPrice: maximum price of each item
//  Note: Omits maxPrice if 0
export async function getProductQuery(qty:number,minPrice:number,maxPrice:number): Promise<WithId<Product>[]> {
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
    console.log('DB Query at ' + Date.now().toString() + " QID:6");
    return filteredDocs as WithId<Product>[];
}



// Returns all cart items of the given user
export async function getUserCart(username:string) {
    const query={ "username": { $eq:username }};
    const filter:FindOptions<CartItem>={projection: { _id: 0, username: 0 } };
    const filteredDocs = await DB.collection(CART_COLLECTION).find(query,filter).toArray();
    console.log('DB Query at ' + Date.now().toString() + " QID:15");
    return filteredDocs;
}

// Returns the specific cart item associated with the given username and product id
export async function getUserCartForProduct(username:string,productId:number) {
    const query={ "username": { $eq:username }, "productId": { $eq:productId } };
    const filter:FindOptions<CartItem>={projection: { _id: 0, quantity: 1 } };
    const filteredDocs = await DB.collection(CART_COLLECTION).findOne(query,filter);
    console.log('DB Query at ' + Date.now().toString() + " QID:16");
    return filteredDocs;
}

// Deletes the product listing
export async function removeProduct(productId: number) {
    const filter:Filter<Product> = { 
        "productId": { $eq:productId }
    };

    console.log('DB Query at ' + Date.now().toString() + " QID:22");
    console.log("DELETED product with ID: ", productId);
    await DB.collection<Product>(PRODUCT_COLLECTION)
                .deleteOne(filter);
}

// Deletes all cart items with the give product Id
export async function removeCartItemsByProductId(productId: number) {
    let filter: Filter<CartItem> = {
        "productId": { $eq : productId }
    }
    let out = await DB.collection<CartItem>(CART_COLLECTION).deleteMany(filter);
    console.log(`deleted all carts with product Id: ${productId}, output=${out}`);
}

// updates user's cart for the product with given quantity
export async function updateUserCart(username:string,productId:number,quantity:number) {
    let currentCartItem = await getUserCartForProduct(username,productId);
    console.log('DB Query at ' + Date.now().toString() + " QID:17");
    if (quantity == 0 && currentCartItem == null) {
        // No changes needed
        return;
    }
    if (quantity == 0) {
        // Delete existing
        const filter:Filter<CartItem> = { 
            "username": { $eq:username },
            "productId": { $eq:productId }
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
        "username": { $eq:username },
        "productId": { $eq:productId }
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
    let query={'username': {$eq:testUsername}};
    let exists = await DB.collection(USER_COLLECTION).find(query).hasNext();
    console.log('DB Query at ' + Date.now().toString() + " QID:3");
    return exists;
}

// Returns user document if the given username exists in the database
export async function getUserDetails(username:string) : Promise<WithId<User>> {
    const query={'username': {$eq:username}};
    const filter:FindOptions<Product> = {
        projection: { _id: 0, hash: 0 }
    };
    let user = await DB.collection<User>(USER_COLLECTION).find(query,filter).toArray();
    console.log('DB Query at ' + Date.now().toString() + " QID:3");
    return user[0];
}

export async function deleteReview(username:string,productId:number) {
    let filter:Filter<Review> = {
        "username": {$eq: username},
        "productId": {$eq: productId}
    }
    let out = await  DB.collection<Review>(REVIEW_COLLECTION).deleteOne(filter);
    console.log("Deleted a review: ", out);
}

export async function reviewExists(username:string,productId:number) {
    let filter:Filter<Review> = {
        "username": {$eq: username},
        "productId": {$eq: productId}
    }
    let document = await DB.collection<Review>(REVIEW_COLLECTION).findOne(filter);
    if (document == null) return false;
    return true;
}

export async function createReview(title:string,description:string,rating:number,
    username:string,productId:number) {
    
    let document:Review = {
        title: title,
        description: description,
        rating: rating,
        username: username,
        productId: productId
    }
    console.log('DB Query at ' + Date.now().toString() + " QID:35");
    console.log("NEW Review created with product ID: ", productId, " and user: ",username);
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
    let document:Product = {
        productId: productId,
        username: username,
        name:name,
        description:description,
        price:price,
        images:images
    }
    console.log('DB Query at ' + Date.now().toString() + " QID:20");
    console.log("NEW product created with ID: ", productId);
    await DB.collection<Product>(PRODUCT_COLLECTION).insertOne(document);
}

// Adds a new product listing
export async function updateProductListing(productId: number, username: string,
        name: string, description:string, price: number, images: string[]) {

    let filter: Filter<Product> = {
        "productId" : { $eq: productId}
    }
    await DB.collection<Product>(PRODUCT_COLLECTION).deleteOne(filter);
    let document:Product = {
        productId: productId,
        username: username,
        name:name,
        description:description,
        price:price,
        images:images
    }
    console.log('DB Query at ' + Date.now().toString() + " QID:21");
    console.log("UPDATED product with ID: ", productId);
    await DB.collection<Product>(PRODUCT_COLLECTION).insertOne(document);
}
// deletes a user from the database
export async function deleteUser(username: string) {
    const filter: Filter<User> = { username: username };
    await DB.collection<User>(USER_COLLECTION).deleteOne(filter);
}

export async function updateReview(username:string,productId:number,title:string,description:string,rating:number) {
    let filter:Filter<Review> = {
        "username": {$eq: username},
        "productId": {$eq: productId}
    }
    await DB.collection<Review>(REVIEW_COLLECTION).deleteOne(filter);
    let updatedReview:Review = {
        title: title,
        description: description,
        rating: rating,
        username: username,
        productId: productId
    }
    await DB.collection<Review>(REVIEW_COLLECTION).replaceOne(filter,updatedReview);
    console.log("UPDATED review for product, user: " , productId, username);
    console.log('DB Query at ' + Date.now().toString() + " QID:51");
}

// Updates a user with the given details
export async function updateUser(username:string,firstName:string,lastName:string,address:string,phone:number,email:string,profilePhoto:string) {
    const filter: Filter<User> = { username: username };

    let oldUser = await DB.collection<User>(USER_COLLECTION)
                    .findOne(filter);

    if (oldUser==null) {
        console.log('dbError 1')
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
    console.log('DB Query at ' + Date.now().toString() + " QID:30");
    console.log('UPDATED user details: ',username);
    await DB.collection<User>(USER_COLLECTION).insertOne(newUser);
}

// OLD !!!
// Saves the given username and hash in database
// REQUIRES: username is not already in the database
export async function saveUserAndHash(username: string, hash:string) {
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
    console.log('DB Query at ' + Date.now().toString() + " QID:4");
    await DB.collection(USER_COLLECTION).insertOne(document);
}

// Saves the username and hash in database
// REQUIRES: username is not already in the database
export async function saveUser(user: User) {
    console.log('DB Query at ' + Date.now().toString() + " QID:10");
    await DB.collection(USER_COLLECTION).insertOne(user);
}

// Returns the has corresponding to the given username
// REQUIRES: such a username exists in database
export async function getUserHash(username:string):Promise<string> {
    let query={'username': {$eq:username}};
    const document = await DB.collection(USER_COLLECTION).findOne(query);
    console.log('DB Query at ' + Date.now().toString() + " QID:5");
    return (document != null) ? document['hash'] : '';
}
