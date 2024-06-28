import express from 'express';
import { handleUserNameInformation, handleSearch } from '../handlers/miscHandler';

const miscRouter = express.Router();

miscRouter.get('/user/:username',handleUserNameInformation);
miscRouter.post('/search',handleSearch);

export default miscRouter;
