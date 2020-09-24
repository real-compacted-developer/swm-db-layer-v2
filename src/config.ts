import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: parseInt(process.env.PORT!, 10) || 8080,
  database: {
    username: process.env.DB_USERNAME!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_DATABASE!,
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT!, 10) || 27017
  }
};

export default config;
