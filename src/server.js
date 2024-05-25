import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';
import { ENV_VAR } from './constants/constans.js';
import { notFoundMiddleware } from './middlewares/notFoundMiddleware.js';
import { errorHandlerMiddleware } from './middlewares/errorHandlerMiddleware.js';
import { getAllContacts, getContactById } from './services/contacts.js';

export const setupServer = () => {
  const app = express();

  app.use(pino({ transport: { target: 'pino-pretty' } }));

  app.use(cors());

  app.get('/contacts', async (req, res, next) => {
    try {
      const contacts = await getAllContacts();
      res.json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
      });
    } catch (error) {
      next(error);
    }
  });

  app.get('/contacts/:contactId', async (req, res, next) => {
    try {
      const contactId = req.params.contactId;
      const contact = await getContactById(contactId);

      if (!contact) {
        return res.status(404).json({
          status: 404,
          message: `Contact with id ${contactId} not found!`,
        });
      } else {
        return res.json({
          status: 200,
          message: `Successfully found contact with id ${contactId}!`,
          data: contact,
        });
      }
    } catch (error) {
      next(error);
    }
  });

  app.use('*', notFoundMiddleware);

  app.use(errorHandlerMiddleware);

  const PORT = env(ENV_VAR.PORT, 3000);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
