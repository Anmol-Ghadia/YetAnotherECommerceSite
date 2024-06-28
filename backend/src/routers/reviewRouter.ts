import express from 'express';
import { handleAllReviewsForProduct, handleReviewStats,handleSingleAllReview,handleCreateReview } from '../handlers/reviewHandler';
import { authMiddleware } from '../middleware/authMiddleware';

const reviewRouter = express.Router();

reviewRouter.get('/user/all',authMiddleware, handleSingleAllReview);
reviewRouter.post('/product/:productId', authMiddleware, handleCreateReview);
reviewRouter.get('/product/:productId', handleAllReviewsForProduct);
reviewRouter.get('/product/stats/:productId', handleReviewStats);

export default reviewRouter;
