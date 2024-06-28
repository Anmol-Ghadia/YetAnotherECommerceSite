import dotenv from "dotenv";

dotenv.config();

// Returns true if all are set
export function isEnvironmentVariableSet():boolean {
    if (process.env.DB_URI == null) {
        console.log("DB_URI not set");
        return false;
    }
    if (process.env.DB_NAME == null) {
        console.log("DB_NAME not set");
        return false;
    }
    if (process.env.PRODUCT_COLLECTION_NAME == null) {
        console.log("PRODUCT_COLLECTION_NAME not set");
        return false;
    }
    if (process.env.USER_COLLECTION_NAME == null) {
        console.log("USER_COLLECTION_NAME not set");
        return false;
    }
    if (process.env.REVIEW_COLLECTION_NAME == null) {
        console.log("REVIEW_COLLECTION_NAME not set");
        return false;
    }
    if (process.env.CART_COLLECTION_NAME == null) {
        console.log("CART_COLLECTION_NAME not set");
        return false;
    }
    if (process.env.JWT_PRIVATE_KEY == null) {
        console.log("JWT_PRIVATE_KEY not set");
        return false;
    }
    if (process.env.JWT_SESSION_TIME == null) {
        console.log("JWT_SESSION_TIME not set");
        return false;
    }
    return true;
}
