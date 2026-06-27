import config from '@/config';

import type { CorsOptions } from 'cors';

const corsOptions: CorsOptions = {
  origin(requestOrigin, callback) {
    if (requestOrigin && config.CORS_WHITELIST) {
      callback(null, true);
    } else {
      callback(
        config.NODE_ENV === 'development'
          ? null
          : new Error('Not allowed origin'),
      );
    }
  },
};

export default corsOptions;
