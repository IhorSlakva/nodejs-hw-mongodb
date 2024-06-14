import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/users.js';
import bcrypt from 'bcrypt';
import { SessionsCollections } from '../db/models/sessions.js';
import { createSession } from '../utils/createSession.js';

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

  return await SessionsCollections.create({
    userId: user._id,
    ...createSession(),
  });
};

export const refreshSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionsCollections.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  await SessionsCollections.deleteOne({ _id: sessionId });

  return await SessionsCollections.create({
    userId: session.userId,
    ...createSession(),
  });
};

export const logoutUser = async ({ sessionId, refreshToken }) => {
  return await SessionsCollections.deleteOne({
    _id: sessionId,
    refreshToken,
  });
};
