import { TIME_FOR_TOKEN } from '../constants/constans.js';

export const setupSession = (res, session) => {
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + TIME_FOR_TOKEN.THIRTY_DAYS),
  });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + TIME_FOR_TOKEN.THIRTY_DAYS),
  });
};
