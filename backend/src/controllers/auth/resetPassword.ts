import config from '@/config';
import { logger } from '@/lib/winston';
import nodemailerTransport from '@/lib/nodemailer';

import { verifyPasswordResetToken } from '@/lib/jwt';
import { passwordResetInfoTemplate } from '@/mailTemplate/passwordResetInfo';

import bcrypt from 'bcrypt';

import User from '@/models/user';

import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import type { Request, Response } from 'express';
import type { ResetLinkPayload } from '@/lib/jwt';
import type { IUser } from '@/models/user';

type RequestQuery = { token: string };
type RequestBody = Pick<IUser, 'password'>;

const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { token } = req.query as RequestQuery;

  const { password } = req.body as RequestBody;

  try {
    const { email } = verifyPasswordResetToken(token) as ResetLinkPayload;

    const user = await User.findOne({ email })
      .select('password passwordResetToken name')
      .exec();

    if (!user?.passwordResetToken) {
      res.status(404).json({
        code: 'TokenNotFound',
        message: 'This token is already used',
      });
      return;
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    user.password = hashPassword;
    user.passwordResetToken = null;
    await user.save();
    res.sendStatus(204);

    await nodemailerTransport.sendMail({
      from: 'route.io <anoop9569110314@gmail.com>',
      to: email,
      subject: 'Password Successfully Reset',
      html: passwordResetInfoTemplate({
        name: user.name,
      }),
    });
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      res.status(401).json({
        code: 'ResetTokenExpired',
        message: 'Your password reset token has been expired',
      });
      return;
    }

    if (error instanceof JsonWebTokenError) {
      res.status(401).json({
        code: 'ResetTokenError',
        message: 'Invalid reset password token',
      });
      return;
    }

    res.status(500).json({
      code: 'ServerError',
      message: 'Server Internal Errror',
    });
  }
};

export default resetPassword;
