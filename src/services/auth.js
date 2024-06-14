import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/users.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { SessionsCollections } from '../db/models/sessions.js';
import { TIME_FOR_TOKEN } from '../constants/constans.js';

export const registerUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (user) {
    throw createHttpError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);
  return await UsersCollection.create({
    ...payload,
    password: hashedPassword,
  });
};

export const loginUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const isEqual = await bcrypt.compare(payload.password, user.password);

  if (!isEqual) throw createHttpError(401, 'Unauthorized');

  await SessionsCollections.deleteOne({ userId: user._id });

  const accessToken = crypto.randomBytes(20).toString('base64');
  const refreshToken = crypto.randomBytes(20).toString('base64');

  return await SessionsCollections.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(
      Date.now() + TIME_FOR_TOKEN.FIFTEEN_MINUTES,
    ),
    refreshTokenValidUntil: new Date(Date.now() + TIME_FOR_TOKEN.THIRTY_DAYS),
  });
};

export const logoutUser = async (refreshToken) => {
  return await SessionsCollections.deleteOne({
    refreshToken: refreshToken,
  });
};
