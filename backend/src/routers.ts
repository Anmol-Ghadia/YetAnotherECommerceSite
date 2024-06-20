import express from 'express';
import { handleRangeProductById, handleSingleProductById } from './handlers';
export {router};


const router = express.Router();

// Products handler
router.get('/product/:productId', handleSingleProductById);
router.get('/product/:startProductId/:endProductId', handleRangeProductById);
