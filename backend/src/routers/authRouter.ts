import express from 'express';
import { 
    handleUserLogin,
    handleUserRegister,
    checkJWTValidity,
} from '../handlers';

const authRouter = express.Router();


// Route to handle login attempts
authRouter.post('/login',handleUserLogin);
authRouter.get('/verify',checkJWTValidity);
// Route to register a new user
authRouter.post('/register',handleUserRegister);

export default authRouter;
