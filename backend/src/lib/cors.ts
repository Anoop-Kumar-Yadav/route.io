import config from '@/config';
import type { CorsOptions } from 'cors';

const corsOptions: CorsOptions = {
  origin(requestOrigin, callback) {
    // No frontend for now
    if (!config.CLIENT_ORIGIN) {
      return callback(null, true);
    }

    // When Frontend ready
    if (!requestOrigin || config.CLIENT_ORIGIN === requestOrigin) {
      return callback(null, true);
    }

    callback(new Error(`Not allowed origin: ${requestOrigin}`));
  },
  credentials: true,
};

export default corsOptions;
