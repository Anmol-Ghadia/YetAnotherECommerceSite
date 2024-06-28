import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { 
    handleUserCartQuery,
    handleUserCartSpecificQuery,
    handleUserCartSpecificUpdate,
    handleUpdateUserDetails,
    handleDeleteUser
} from '../handlers/userHandler';

const userRouter = express.Router();

userRouter.get('/cart',authMiddleware,handleUserCartQuery);
userRouter.get('/cart/product/:productId',authMiddleware,handleUserCartSpecificQuery);
userRouter.post('/cart/product/:productId',authMiddleware,handleUserCartSpecificUpdate);
userRouter.post('/update',authMiddleware,handleUpdateUserDetails);
userRouter.delete('/remove',authMiddleware,handleDeleteUser); // TODO in handler

export default userRouter;
