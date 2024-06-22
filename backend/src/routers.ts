import express, {Request,Response} from 'express';
import { 
    handleRangeProductById,
    handleSingleProductById,
    handleUserLogin,
    handleUserRegister,
    checkJWTValidity,
    handleProductQuery
} from './handlers';
export {router};

const router = express.Router();
const productRouter = express.Router();
const authRouter = express.Router();

// Route to handle queries related to products
productRouter.post('/query', handleProductQuery);
productRouter.get('/:productId', handleSingleProductById);
productRouter.get('/:startProductId/:endProductId', handleRangeProductById);

// Route to handle login attempts
authRouter.post('/login',handleUserLogin);
authRouter.get('/verify',checkJWTValidity);
// Route to register a new user
authRouter.post('/register',handleUserRegister);

router.use('/product',productRouter);
router.use('/auth',authRouter);
