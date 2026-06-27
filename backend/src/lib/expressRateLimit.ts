import { rateLimit } from 'express-rate-limit';

import config from '@/config';

import type { Options, RateLimitRequestHandler } from 'express-rate-limit';

type RateLimitType = 'basic' | 'auth' | 'passReset';

const defaultLimitOpt: Partial<Options> = {
  windowMs: config.WINDOW_MS,
  legacyHeaders: false,
  standardHeaders: true,
};

const rateLimitOpt = new Map<RateLimitType, Partial<Options>>([
  ['basic', { ...defaultLimitOpt, limit: 1000 }],
  ['auth', { ...defaultLimitOpt, limit: 100 }],
  ['passReset', { ...defaultLimitOpt, limit: 3 }],
]);

const expressRateLimit = (type: RateLimitType): RateLimitRequestHandler => {
  return rateLimit(rateLimitOpt.get(type));
};

export default expressRateLimit;
