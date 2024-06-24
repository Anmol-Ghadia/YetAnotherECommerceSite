import express from 'express';
import { 
    handleCartQuery
} from '../handlers';

const userRouter = express.Router();

// To get then information regarding cart
userRouter.post('/cart',handleCartQuery);

export default userRouter;
