import { TIME_FOR_TOKEN } from '../constants/constants.js';
import crypto from 'crypto';

export const createSession = () => {
  const accessToken = crypto.randomBytes(20).toString('base64');
  const refreshToken = crypto.randomBytes(20).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(
      Date.now() + TIME_FOR_TOKEN.FIFTEEN_MINUTES,
    ),
    refreshTokenValidUntil: new Date(Date.now() + TIME_FOR_TOKEN.THIRTY_DAYS),
  };
};
