import bcrypt from 'bcrypt';
import { logger } from '@/lib/winston';
import config from '@/config';
import { generateMongooseId } from '@/utils';

import User from '@/models/user';

import type { Request, Response } from 'express';
import type { IUser } from '@/models/user';

import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';

type RequestBody = Pick<IUser, 'name' | 'email' | 'password' | 'role'>;

const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, role } = req.body as RequestBody;

  if (role === 'admin' && !config.WHITELISTED_EMAILS?.includes(email)) {
    res.status(400).json({
      code: 'BadRequest',
      message: 'You are not allowed to create an admin account',
    });

    return;
  }

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);

  try {
    // Generate custom userId
    const userId = generateMongooseId();

    // Generate refresh token for registered user
    const refreshToken = generateRefreshToken({ userId: userId });

    // Generate access token for registered user
    const accessToken = generateAccessToken({ userId: userId });

    //  Insert new user with provided credentials
    const user = await User.create({
      _id: userId,
      name,
      email,
      password: hashPassword,
      role,
      refreshToken,
    });
    res.cookie('refreshToken', refreshToken, {
      maxAge: config.COOKIE_MAX_AGE,
      httpOnly: config.NODE_ENV === 'production',
      secure: true,
    });

    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        passwordResetToken: user.passwordResetToken,
        role: user.role,
      },
      accessToken,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Server Internal Errror',
    });
  }
};

export default register;
