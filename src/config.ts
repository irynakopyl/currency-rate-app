import * as dotenv from 'dotenv';
dotenv.config({
  path: '${__dirname}/../.env',
});

export const config = {
  db: {
    host: String(process.env.DB_HOST),
    port: Number(process.env.DB_PORT),
    database: String(process.env.DB_NAME),
    username: String(process.env.DB_USER),
    password: String(process.env.DB_PASSWORD),
  },
  api: {
    emailServer: {
      OAUTH_EMAIL: process.env.OAUTH_EMAIL || ('' as string),
      OAUTH_CLIENT_ID: process.env.OAUTH_CLIENT_ID || ('' as string),
      OAUTH_CLIENT_SECRET: process.env.OAUTH_CLIENT_SECRET || ('' as string),
      OAUTH_REFRESH_TOKEN: process.env.OAUTH_REFRESH_TOKEN || ('' as string),
    },
    currencyUrl: 'https://api.privatbank.ua/p24api/pubinfo?exchange&coursid=5',
  },
};
