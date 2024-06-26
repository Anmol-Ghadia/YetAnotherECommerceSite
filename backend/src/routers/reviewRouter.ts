import express from 'express';
import { handleAllReviewsForProduct, handleReviewStats } from '../handlers/reviewHandler';

const reviewRouter = express.Router();

reviewRouter.get('/product/:productId', handleAllReviewsForProduct);
reviewRouter.get('/product/stats/:productId', handleReviewStats);

export default reviewRouter;
