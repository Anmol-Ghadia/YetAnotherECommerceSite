import express from 'express';
import { handleAllReviewsForProduct,handleReviewUpdate, handleReviewStats,handleSingleAllReview,handleCreateReview,handleDeleteReview } from '../handlers/reviewHandler';
import { authMiddleware } from '../middleware/authMiddleware';

const reviewRouter = express.Router();

reviewRouter.get('/user/all',authMiddleware, handleSingleAllReview);
reviewRouter.get('/product/:productId', handleAllReviewsForProduct);
reviewRouter.get('/product/stats/:productId', handleReviewStats);
reviewRouter.post('/:productId', authMiddleware, handleCreateReview);
reviewRouter.patch('/:productId',authMiddleware,handleReviewUpdate);
reviewRouter.delete('/:productId',authMiddleware,handleDeleteReview);
export default reviewRouter;
