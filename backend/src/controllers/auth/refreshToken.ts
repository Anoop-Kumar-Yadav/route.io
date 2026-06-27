import { verifyRefreshToken, generateAccessToken } from '@/lib/jwt';

import { logger } from '@/lib/winston';

import type { Request, Response } from 'express';

import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import type { TokenPayload } from '@/lib/jwt';

const refreshToken = async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    res.status(401).json({
      code: 'Unauthorization',
      message: 'Refresh token required',
    });

    return;
  }

  try {
    const { userId } = verifyRefreshToken(refreshToken) as TokenPayload;
    const accessToken = generateAccessToken({ userId });
    res.status(200).json({
      accessToken,
    });
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      res.status(401).json({
        code: 'RefreshTokenExpired',
        message: 'Refresh token expired',
      });

      return;
    }

    if (error instanceof JsonWebTokenError) {
      res.status(401).json({
        code: 'RefreshTokenError',
        message: 'Invalid refresh token',
      });
      return;
    }

    res.status(500).json({
      code: 'ServerError',
      message: 'Server Internal Errror',
    });
  }
};

export default refreshToken;
