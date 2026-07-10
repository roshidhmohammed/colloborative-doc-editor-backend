// Database configuration

import dotenv from 'dotenv';
dotenv.config();

export default {
  uri: process.env.DATABASE_URL,
};
