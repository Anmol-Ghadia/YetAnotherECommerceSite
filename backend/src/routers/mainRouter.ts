import express from 'express';
import authRouter from './authRouter';
import userRouter from './userRouter';
import productRouter from './productRouter';
import reviewRouter from './reviewRouter';
import miscRouter from './miscRouter';

const mainRouter = express.Router();

mainRouter.use('/product',productRouter);
mainRouter.use('/auth',authRouter);
mainRouter.use('/user',userRouter);
mainRouter.use('/review',reviewRouter);
mainRouter.use('/misc',miscRouter);

export default mainRouter;
