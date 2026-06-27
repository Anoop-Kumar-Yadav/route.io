import config from '@/config';
import { logger } from '@/lib/winston';

import type { NextFunction, Request, Response } from 'express';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { TokenPayload } from '@/lib/jwt';

import { verifyAccessToken, verifyRefreshToken } from '@/lib/jwt';

const authentication = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(401).json({
      code: 'AccessTokenError',
      message: 'Access token is required',
    });
    return;
  }

  const [_, accessToken] = authorization.split(' ');

  try {
    const { userId } = verifyAccessToken(accessToken) as TokenPayload;
    req.userId = userId;
    next();
  } catch (error) {
    logger.error(error);
    if (error instanceof TokenExpiredError) {
      res.status(401).json({
        code: 'AccessTokenExpired',
        message: 'Access token expired',
      });
      return;
    }
    if (error instanceof JsonWebTokenError) {
      res.status(401).json({
        code: 'AccessTokenError',
        message: 'Invalid access token',
      });
      return;
    }
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error ',
    });
  }
};

export default authentication;
