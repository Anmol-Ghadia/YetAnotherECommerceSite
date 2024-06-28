import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { checkJWTValidity, handleLogin,handleRegister } from '../handlers/authHandler';

const authRouter = express.Router();

authRouter.post('/login',handleLogin);
authRouter.post('/register',handleRegister);
authRouter.get('/verify', authMiddleware, checkJWTValidity);

export default authRouter;
