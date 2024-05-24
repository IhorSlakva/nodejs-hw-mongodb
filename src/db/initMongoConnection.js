import mongoose from 'mongoose';
import { env } from '../utils/env.js';
import { ENV_VAR } from '../constants/constans.js';

export const initMongoConnection = async () => {
  try {
    const user = env(ENV_VAR.MONGODB_USER);
    const pwd = env(ENV_VAR.MONGODB_PASSWORD);
    const url = env(ENV_VAR.MONGODB_URL);
    const db = env(ENV_VAR.MONGODB_DB);
    const connectionLink = `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority&appName=Cluster
`;
    await mongoose.connect(connectionLink);
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.log(error);
  }
};
