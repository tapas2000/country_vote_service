import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  databasePath: process.env.DATABASE_PATH || './database.sqlite',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:4000',
  restCountriesApi: process.env.REST_COUNTRIES_API || 'https://restcountries.com/v3.1'
};
