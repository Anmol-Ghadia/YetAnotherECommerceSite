import express from 'express';
import { 
    checkJWTValidity,
} from '../handlers';
import { handleLogin,handleRegister } from '../handlers/authHandler';

const authRouter = express.Router();


authRouter.post('/login',handleLogin);
authRouter.get('/verify',checkJWTValidity);  // OLD
authRouter.post('/register',handleRegister);

export default authRouter;
