import express from 'express';
import { 
    handleUserRegister,
    checkJWTValidity,
} from '../handlers';
import { handleLogin } from '../handlers/authHandler';

const authRouter = express.Router();


// Route to handle login attempts
// authRouter.post('/login',handleUserLogin); // OLD
authRouter.post('/login',handleLogin);
authRouter.get('/verify',checkJWTValidity);  // OLD
// Route to register a new user
authRouter.post('/register',handleUserRegister); // OLD

export default authRouter;
