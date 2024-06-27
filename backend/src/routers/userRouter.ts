import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { handleUserCartQuery,handleUserCartSpecificQuery,handleUserCartSpecificUpdate } from '../handlers/userHandler';

const userRouter = express.Router();

// To get then information regarding cart
userRouter.get('/cart',authMiddleware,handleUserCartQuery);
userRouter.get('/cart/product/:productId',authMiddleware,handleUserCartSpecificQuery);
userRouter.post('/cart/product/:productId',authMiddleware,handleUserCartSpecificUpdate);

export default userRouter;
