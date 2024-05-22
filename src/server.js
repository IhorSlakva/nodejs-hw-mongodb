import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';
import { ENV_VAR } from './constants/constans.js';
import { notFoundMiddleware } from './middlewares/notFoundMiddleware.js';

export const setupServer = () => {
  const app = express();

  app.use(pino({ transport: { target: 'pino-pretty' } }));

  app.use(cors());

  app.use('*', notFoundMiddleware);

  const PORT = env(ENV_VAR.PORT, 3000);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
