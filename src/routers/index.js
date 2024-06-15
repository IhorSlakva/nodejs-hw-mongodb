import { Router } from 'express';
import authRouter from './auth.js';
import contactsRouter from './contacts.js';

const rootRouter = Router();

rootRouter.use('/auth', authRouter);

rootRouter.use('/contacts', contactsRouter);

export default rootRouter;
