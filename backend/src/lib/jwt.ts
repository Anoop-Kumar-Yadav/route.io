import jwt from 'jsonwebtoken';

import config from '@/config';

import { JwtPayload } from 'jsonwebtoken';
import type { Types } from 'mongoose';

export type TokenPayload = { userId: Types.ObjectId };
export type ResetLinkPayload = { email: string };

const generateAccessToken = (payload: TokenPayload) => {
  const token = jwt.sign(payload, config.JWT_ACCESS_SECRET as string, {
    expiresIn: '30m',
  });

  return token;
};

const generateRefreshToken = (payload: TokenPayload) => {
  const token = jwt.sign(payload, config.JWT_REFRESH_SECRET as string, {
    expiresIn: '1d',
  });

  return token;
};

// Generate JWT token for reset password
const generatePasswordResetToken = (payload: ResetLinkPayload) => {
  const resetToken = jwt.sign(
    payload,
    config.JWT_PASSWORD_RESET_SECRET as string,
    {
      expiresIn: '1h',
    },
  );
  return resetToken;
};

// Verify access token

const verifyAccessToken = (accessToken: string): string | JwtPayload => {
  return jwt.verify(accessToken, config.JWT_ACCESS_SECRET as string);
};

// Verify refresh token

const verifyRefreshToken = (refreshToken: string): string | JwtPayload => {
  return jwt.verify(refreshToken, config.JWT_REFRESH_SECRET as string);
};

// Verify password reset token
const verifyPasswordResetToken = (
  passwordResetToken: string,
): string | JwtPayload => {
  return jwt.verify(
    passwordResetToken,
    config.JWT_PASSWORD_RESET_SECRET as string,
  );
};
export {
  generateAccessToken,
  generateRefreshToken,
  generatePasswordResetToken,
  verifyAccessToken,
  verifyRefreshToken,
  verifyPasswordResetToken,
};
