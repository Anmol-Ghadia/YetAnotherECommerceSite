import express, {Request,Response} from 'express';
import { 
    handleRangeProductById,
    handleSingleProductById,
    handleUserLogin,
    handleUserRegister,
    checkJWTValidity
} from './handlers';
export {router};

const router = express.Router();

// Route to handle queries related to products
router.get('/product/:productId', handleSingleProductById);
router.get('/product/:startProductId/:endProductId', handleRangeProductById);

// Route to handle login attempts
router.post('/auth/login',handleUserLogin);

// Route to register a new user
router.post('/auth/register',handleUserRegister);
router.get('/auth/verify',checkJWTValidity);
