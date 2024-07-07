import { Db, Filter, UpdateFilter, WithoutId } from "mongodb";
import { generateUserWithUsername, User } from "../schema";
import Cache from "../cache";
import { log } from "../../logger";
import { queryDeleteProductsByUser } from "./productQueries";
import { queryDeleteCartItemByUser } from "./cartQueries";
import { queryDeleteReviewsByUser } from "./reviewQueries";

let USER_COLLECTION:string;
let USER_CACHE: Cache<User>;
let DB: Db;

export function initializeUserQueries(USER_COLLECTION_NAME:string, givenUSER_CACHE:Cache<User>, givenDB:Db) {
    USER_COLLECTION = USER_COLLECTION_NAME;
    USER_CACHE = givenUSER_CACHE;
    DB = givenDB;
}

// REQUIRES: user 'u' exists such that compareUser(updatedUser,u) is true
// Updates a user
export async function queryUpdateUser(updatedUser:User): Promise<void> {
    const filter: Filter<User> = { 
        username: { $eq: updatedUser.username}
    };

    const updateFilter: UpdateFilter<User> = {
        $set: {
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            address: updatedUser.address,
            phone: updatedUser.phone,
            email: updatedUser.email,
            profilePhoto: updatedUser.profilePhoto
        }
    }

    await DB
        .collection<User>(USER_COLLECTION)
        .updateOne(filter,updateFilter)

    // remove user from cache and let another query cache the updated user document
    // because hash is not available here
    USER_CACHE.pop(updatedUser);
    queryReadUser(updatedUser.username);

    log(2,'DB-USER',`QID:1, Updated user details for: (${updatedUser.username})`);
}

// Deletes a user from db
export async function queryDeleteUser(username: string):Promise<void> {
    const filter: Filter<User> = {
        username: { $eq: username}
    }; 

    queryDeleteProductsByUser(username);
    queryDeleteReviewsByUser(username);
    queryDeleteCartItemByUser(username);

    DB
    .collection<User>(USER_COLLECTION)
    .deleteOne(filter)
    .then(()=>{

        USER_CACHE.pop(generateUserWithUsername(username));  
        log(2,'DB-USER',`QID:2, Deleted user: (${username})`);

    })
}

// Returns all user details (including hash) 
export async function queryReadUser(username: string): Promise<WithoutId<User> | null> {
    const query:Filter<User> = {
        'username': { $eq:username }
    };
 
    // Check if cache has it
    if (USER_CACHE.has(generateUserWithUsername(username))) {
        log(2,'CACHE-USER',`QID:3, got a hit for user: (${username})`);
        return USER_CACHE.get(generateUserWithUsername(username));
    }
    const dbUser:WithoutId<User> | null = await DB
        .collection<User>(USER_COLLECTION)
        .findOne(query);

    // Update cache
    if (dbUser!=null) USER_CACHE.push(dbUser);

    log(2,'DB-USER',`QID:3, retrived user details: (${username})`);
    return dbUser;
}

// Returns true if the username exists in the database
export async function queryExistsUser(testUsername:string):Promise<boolean> {
    return (await queryReadUser(testUsername) != null);
}


// REQUIRES: no user 'u' exists such that compareUser(newUser,u) is true
// creates a new user on the database
export async function queryCreateUser(newUser: User):Promise<void> {

    DB
    .collection<User>(USER_COLLECTION)
    .insertOne(newUser)
    .then(()=>{
        log(2,'DB-USER',`QID:4, Created user: (${newUser.username})`);
        USER_CACHE.push(newUser);
    })
}
