import nodemailer from 'nodemailer';
import { env } from './env.js';
import { ENV_VARS } from '../constants/constans.js';

const transport = nodemailer.createTransport({
  host: env(ENV_VARS.SMTP_HOST),
  port: Number(env(ENV_VARS.SMTP_PORT)),
  auth: {
    user: env(ENV_VARS.SMTP_USER),
    pass: env(ENV_VARS.SMTP_PASSWORD),
  },
});

export const sendMail = async (options) => {
  return await transport.sendMail(options);
};
