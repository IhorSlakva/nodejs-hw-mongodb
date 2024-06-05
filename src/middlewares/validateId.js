import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';

export const validateId =
  (idName = 'id') =>
  (req, res, next) => {
    const id = req.params[idName];

    if (!id) {
      throw new Error('Id in validateId is not provider');
    }

    if (!isValidObjectId(id)) {
      return next(createHttpError(400, 'Invalid id'));
    }

    return next();
  };
