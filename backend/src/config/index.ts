import dotenv from 'dotenv';

dotenv.config();

const _1H_IN_MILLISECONDS = 1000 * 60 * 60;
const _7D_IN_MILLISECONDS = _1H_IN_MILLISECONDS * 24 * 7;

const config = {
  PORT: process.env.PORT!,
  NODE_ENV: process.env.NODE_ENV!,
  LOGTAIL_INGESTING_HOST: process.env.LOGTAIL_INGESTING_HOST
    ? `https://${process.env.LOGTAIL_INGESTING_HOST.replace(/^https?:\/\//, '')}`
    : undefined,
  LOGTAIL_SOURCE_TOKEN: process.env.LOGTAIL_SOURCE_TOKEN!,
  WINDOW_MS: _1H_IN_MILLISECONDS,
  MONGO_CONNECTION_URI: process.env.MONGO_CONNECTION_URI,
  WHITELISTED_EMAILS: process.env.WHITELISTED_EMAILS?.split(','),
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  COOKIE_MAX_AGE: _7D_IN_MILLISECONDS,
  JWT_PASSWORD_RESET_SECRET: process.env.JWT_PASSWORD_RESET_SECRET,
  SMTP_AUTH_PASSWORD: process.env.SMTP_AUTH_PASSWORD,
  SMTP_AUTH_USERNAME: process.env.SMTP_AUTH_USERNAME,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN,
};

export default config;
