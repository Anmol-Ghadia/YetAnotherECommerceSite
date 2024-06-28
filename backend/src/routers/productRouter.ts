import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { 
    handleRangeProductRequest,
    handleSingleProductRequest,
    handleCreateNewProductRequest,
    handleUpdateProductRequest,
    handleRemoveProductRequest,
    handleOwnershipRequest
 } from '../handlers/productHandler';

const productRouter = express.Router();

productRouter.post('/create',authMiddleware,handleCreateNewProductRequest);
productRouter.post('/update/:productId',authMiddleware,handleUpdateProductRequest);
productRouter.delete('/remove/:productId',authMiddleware,handleRemoveProductRequest);
productRouter.get('/owner/:productId',authMiddleware,handleOwnershipRequest);
productRouter.get('/:productId', handleSingleProductRequest);
productRouter.get('/:startProductId/:endProductId', handleRangeProductRequest);

export default productRouter;
