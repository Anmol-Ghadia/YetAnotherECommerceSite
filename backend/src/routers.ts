import express, { Request,Response,NextFunction } from 'express';
import { handleSingleProductById } from './handlers';
export {router};


const router = express.Router();

// Products handler
router.get('/product/:productId', handleSingleProductById);
