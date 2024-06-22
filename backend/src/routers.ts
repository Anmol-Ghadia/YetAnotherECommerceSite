import express, {Request,Response} from 'express';
import { 
    handleRangeProductById,
    handleSingleProductById,
    handleUserLogin,
    handleUserRegister,
    checkJWTValidity,
    handleProductQuery,
    handleCartQuery
} from './handlers';
export {router};

const router = express.Router();
const productRouter = express.Router();
const authRouter = express.Router();
const userRouter = express.Router();

// Route to handle queries related to products
productRouter.post('/query', handleProductQuery);
productRouter.get('/:productId', handleSingleProductById);
productRouter.get('/:startProductId/:endProductId', handleRangeProductById);

// To get then information regarding cart
userRouter.post('/cart',handleCartQuery);

// Route to handle login attempts
authRouter.post('/login',handleUserLogin);
authRouter.get('/verify',checkJWTValidity);
// Route to register a new user
authRouter.post('/register',handleUserRegister);

router.use('/product',productRouter);
router.use('/auth',authRouter);
router.use('/user',userRouter);
