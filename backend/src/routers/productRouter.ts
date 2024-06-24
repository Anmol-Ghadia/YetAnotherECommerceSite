import express, {Request,Response} from 'express';
import { 
    handleRangeProductById,
    handleSingleProductById,
    handleProductQuery,
} from '../handlers';
import { 
    handleRangeProductRequest,
    handleSingleProductRequest
 } from '../handlers/productHandler';

const productRouter = express.Router();

// Route to handle queries related to products
productRouter.post('/query', handleProductQuery); // OLD
// productRouter.get('/:productId', handleSingleProductById); // OLD
productRouter.get('/:productId', handleSingleProductRequest);
// productRouter.get('/:startProductId/:endProductId', handleRangeProductById); // OLD
productRouter.get('/:startProductId/:endProductId', handleRangeProductRequest); // OLD

export default productRouter;
