import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import path from 'path';
import express from 'express';

import corsOptions from '@/lib/cors';
import config from '@/config';
import router from '@/routes';
import { logger, logtail } from '@/lib/winston';
import { connectDatabase, disconnectDatabase } from '@/lib/mongoose';

const PORT = config.PORT;

const app = express();

app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../../public')));
app.use(cookieParser());
app.use(compression());

(async function (): Promise<void> {
  try {
    await connectDatabase();

    app.use('/', router);
    app.listen(PORT, () => {
      logger.info(`SERVER running on port http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server', error);

    if (config.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
})();

const serverTermination = async (signal: NodeJS.Signals): Promise<void> => {
  try {
    await disconnectDatabase();

    logger.info('Server shutdown', { signal });

    logtail?.flush();

    process.exit(0);
  } catch (error) {
    logger.error('Error during server shutdown', error);
  }
};

process.on('SIGTERM', serverTermination);
process.on('SIGINT', serverTermination);

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection', { reason });
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception', { error: err });
  process.exit(1);
});
