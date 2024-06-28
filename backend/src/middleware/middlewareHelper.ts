import jwt from 'jsonwebtoken';

// Returns the username if token is valid
// null otherwise
export function verifyToken(token:string):string|null {
    let key:jwt.Secret = process.env.JWT_PRIVATE_KEY as string;
    try {
        let decoded = jwt.verify(token,key) as jwt.JwtPayload;
        return decoded.username;
    } catch (err) {
        console.log("Error verifying token");
        return null;
    }
}
