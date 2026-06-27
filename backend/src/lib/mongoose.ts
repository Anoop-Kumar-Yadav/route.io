import mongoose from 'mongoose';

// Custom Modules
import config from '@/config';
import { logger } from '@/lib/winston';

import type { ConnectOptions } from 'mongoose';

const connectionOption: ConnectOptions = {
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  },
  dbName: 'route-io',
};

const connectDatabase = async (): Promise<void> => {
  if (!config.MONGO_CONNECTION_URI) {
    throw new Error('Mongo URI is missing');
  }

  try {
    await mongoose.connect(config.MONGO_CONNECTION_URI, connectionOption);
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error('FAiled to connect database', error);
  }
};

const disconnectDatabase = async () => {
  try {
    await mongoose.disconnect();
    logger.info('Database disconnected successfully');
  } catch (error) {
    logger.error('Error during disconnecting from database', error);
  }
};

export { connectDatabase, disconnectDatabase };
