import express from 'express';
import authRouter from './authRouter';
import userRouter from './userRouter';
import productRouter from './productRouter';
import reviewRouter from './reviewRouter';

const mainRouter = express.Router();

mainRouter.use('/product',productRouter);
mainRouter.use('/auth',authRouter);
mainRouter.use('/user',userRouter);
mainRouter.use('/review',reviewRouter);

export default mainRouter;
