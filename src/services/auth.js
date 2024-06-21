import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/users.js';
import bcrypt from 'bcrypt';
import { SessionsCollections } from '../db/models/sessions.js';
import { createSession } from '../utils/createSession.js';
import jwt from 'jsonwebtoken';
import { env } from '../utils/env.js';
import { ENV_VARS } from '../constants/constans.js';
import { sendMail } from '../utils/sendMail.js';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';

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

export const requestResetToken = async (email) => {
  const user = await UsersCollection.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env(ENV_VARS.JWT_SECRET),
    {
      expiresIn: '5m',
    },
  );

  const resetPasswordTemplatePath = path.join(
    process.cwd(),
    'src',
    'templates',
    'reset-password-email.html',
  );

  const templateSourse = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  const template = handlebars.compile(templateSourse);

  const html = template({
    name: user.name,
    link: `${env(ENV_VARS.APP_DOMAIN)}/reset-password?token=${resetToken}`,
  });

  try {
    await sendMail({
      from: env(ENV_VARS.SMTP_FROM),
      to: email,
      subject: 'Reset your password',
      html,
    });
  } catch (error) {
    console.log(error);

    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

export const resetPassword = async ({ token, password }) => {
  let verifedToken;
  try {
    verifedToken = jwt.verify(token, env(ENV_VARS.JWT_SECRET));
  } catch (error) {
    if (error instanceof Error) {
      throw createHttpError(401, 'Token is expired or invalid.');
    }
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await UsersCollection.findOneAndUpdate(
    {
      _id: verifedToken.sub,
      email: verifedToken.email,
    },
    { password: hashedPassword },
  );

  if (!user) throw createHttpError(404, 'User not found!');
};
