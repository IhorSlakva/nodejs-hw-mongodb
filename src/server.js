import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';
import { ENV_VAR } from './constants/constans.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import contactsRouter from './routers/contacts.js';

export const setupServer = () => {
  const app = express();

  app.use(pino({ transport: { target: 'pino-pretty' } }));

  app.use(cors());

  app.use(contactsRouter);

  app.use('*', notFoundHandler);

  app.use(errorHandler);

  const PORT = env(ENV_VAR.PORT, 3000);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
