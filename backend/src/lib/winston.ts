import { transports, createLogger, format, transport } from 'winston';
import { Logtail } from '@logtail/node';
import { LogtailTransport } from '@logtail/winston';

import config from '@/config';

const transportation: transport[] = [];
let logtailInstance: Logtail | null = null;

// 1. Only initialize cloud logging infrastructure when running in production
if (config.NODE_ENV === 'production') {
  if (!config.LOGTAIL_SOURCE_TOKEN || !config.LOGTAIL_INGESTING_HOST) {
    throw new Error('PRODUCTION ERROR: Logtail source token or ingesting host parameter is missing');
  }

  logtailInstance = new Logtail(config.LOGTAIL_SOURCE_TOKEN, {
    endpoint: config.LOGTAIL_INGESTING_HOST,
  });

  transportation.push(new LogtailTransport(logtailInstance));
}

// 2. Local Terminal Development Logger Setup
if (config.NODE_ENV === 'development') {
  const { colorize, combine, timestamp, printf } = format;

  transportation.push(
    new transports.Console({
      format: combine(
        colorize({ all: true }),
        timestamp({ format: 'DD MMMM hh:mm:ss A' }),
        printf(({ level, message, timestamp }) => {
          return `${timestamp} [${level}]: ${message}`;
        }),
      ),
    }),
  );
}

// 3. Create the Main Logging instance
const logger = createLogger({
  transports: transportation,
});

// Export both the unified Winston engine and the isolated Logtail client safely
export { logtailInstance as logtail, logger };
