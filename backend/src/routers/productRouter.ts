import express from 'express';
import { 
    handleProductQuery,
} from '../handlers';
import { 
    handleRangeProductRequest,
    handleSingleProductRequest,
    handleCreateNewProductRequest,
    handleUpdateProductRequest,
    handleRemoveProductRequest,
    handleOwnershipRequest
 } from '../handlers/productHandler';
import { authMiddleware } from '../middleware/authMiddleware';

const productRouter = express.Router();

// Route to handle queries related to products
productRouter.post('/query', handleProductQuery); // OLD
productRouter.post('/create',authMiddleware,handleCreateNewProductRequest);
productRouter.post('/update/:productId',authMiddleware,handleUpdateProductRequest);
productRouter.delete('/remove/:productId',authMiddleware,handleRemoveProductRequest); // !!! more code needed
productRouter.get('/owner/:productId',authMiddleware,handleOwnershipRequest);
productRouter.get('/:productId', handleSingleProductRequest);
productRouter.get('/:startProductId/:endProductId', handleRangeProductRequest);

export default productRouter;
