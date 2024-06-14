import { Router } from 'express';
import authRouter from './auth.js';
import contactsRouter from './contacts.js';
import { authenticate } from '../middlewares/authenticate.js';

const rootRouter = Router();

rootRouter.use('/', authenticate);

rootRouter.use('/auth', authRouter);

rootRouter.use('/contacts', contactsRouter);

export default rootRouter;
