import express from 'express';
import { checkJWTValidity, handleLogin,handleRegister } from '../handlers/authHandler';
import { authMiddleware } from '../middleware/authMiddleware';

const authRouter = express.Router();

authRouter.post('/login',handleLogin);
authRouter.post('/register',handleRegister);
authRouter.get('/verify', authMiddleware, checkJWTValidity);

export default authRouter;
