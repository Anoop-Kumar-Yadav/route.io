// Node modules
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import corsOptions from '@/lib/cors';
import cors from 'cors';

import express from 'express';

// Custom modules
import config from '@/config';
import router from '@/routes';
import { logger, logtail } from '@/lib/winston';
import { connectDatabase, disconnectDatabase } from '@/lib/mongoose';

const PORT = config.PORT;

// Initial Express
const app = express();

// middlewares
app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

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
    await disconnectDatabase;

    logger.info('Server shutdown', signal);

    logtail?.flush();

    process.exit(0);
  } catch (error) {
    logger.error('Error during server shutdown', error);
  }
};

process.on('SIGTERM', serverTermination);
process.on('SIGINT', serverTermination);
