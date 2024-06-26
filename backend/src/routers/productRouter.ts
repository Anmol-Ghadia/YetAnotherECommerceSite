import express from 'express';
import { 
    handleProductQuery,
} from '../handlers';
import { 
    handleRangeProductRequest,
    handleSingleProductRequest
 } from '../handlers/productHandler';

const productRouter = express.Router();

// Route to handle queries related to products
productRouter.post('/query', handleProductQuery); // OLD
productRouter.get('/:productId', handleSingleProductRequest);
productRouter.get('/:startProductId/:endProductId', handleRangeProductRequest);

export default productRouter;
