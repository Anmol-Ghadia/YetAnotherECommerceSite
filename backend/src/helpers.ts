import dotenv from 'dotenv';

dotenv.config();

// Returns true if all are set
export function isEnvironmentVariableSet():boolean {

    const env_vars = [
        'DB_URI','DB_NAME',
        'PRODUCT_COLLECTION_NAME',
        'USER_COLLECTION_NAME',
        'REVIEW_COLLECTION_NAME',
        'CART_COLLECTION_NAME',
        'JWT_PRIVATE_KEY', 'JWT_SESSION_TIME',
        'LOGGING_LEVEL','RESET_DB'
    ];

    for (let index = 0; index < env_vars.length; index++) {
        const element = env_vars[index];
        if (process.env[element] == null) {
            console.error(`environment variable not set: ${element}`)
            return false;
        }
    }
    
    return true;
}
