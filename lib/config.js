import dotenv from 'dotenv';
dotenv.config();
export const dbConfig  = {
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
    DB: process.env.DB_DATABASE_NAME,
    PORT: 5432,
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };

export const mailConfig = {
  USER: "98349e2a-4bb1-4661-9a52-018f06e82b19",
  PASS: "df790e74-bd94-4433-875a-76dce2cff2a5",
  PORT: 587,
  HOST: "smtp.imitate.email"
}

export const twitterConfig = {
  USER: process.env.TWITTER_USER,
  PASS: process.env.TWITTER_PASS,
  
}

export const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Hyperhire Twitter Scraper Test',
    version: '1.0.0',
    description: 'Twitter scraper project using puppeteer',
  },
  servers: [
    {
      url: process.env.SERVER_URL,
      description: 'Development server',
    },
  ],
};