import nodemailer from 'nodemailer';

import config from '@/config';

const nodemailerTransport = nodemailer.createTransport({
  host: config.SMTP_HOST,
  port: 587,
  secure: false,
  pool: true,
  auth: {
    user: config.SMTP_AUTH_USERNAME,
    pass: config.SMTP_AUTH_PASSWORD,
  },
});

export default nodemailerTransport;
