import express from 'express';
import { 
    checkJWTValidity,
} from '../handlers';
import { handleLogin,handleRegister } from '../handlers/authHandler';

const authRouter = express.Router();


// Route to handle login attempts
authRouter.post('/login',handleLogin);
authRouter.get('/verify',checkJWTValidity);  // OLD
// Route to register a new user
authRouter.put('/register',handleRegister);
// authRouter.post('/register',handleUserRegister); // OLD

export default authRouter;
