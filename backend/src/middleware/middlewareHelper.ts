import jwt from 'jsonwebtoken';

// Returns the username if token is valid
// null otherwise
export function verifyToken(token:string):string|null {
    const key:jwt.Secret = process.env.JWT_PRIVATE_KEY as string;
    try {
        const decoded = jwt.verify(token,key) as jwt.JwtPayload;
        return decoded.username;
    } catch (err) {
        return null;
    }
}
