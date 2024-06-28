import express, {Express} from 'express';
import mainRouter from './routers/mainRouter';
import cors from 'cors';

export default function makeApp(): Express {
    const app: Express = express();
    
    app.use(cors());
    
    app.use(express.json());
    app.use('/api-v1',mainRouter);
    
    return app;
}
