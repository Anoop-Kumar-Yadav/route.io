import { logger } from '@/lib/winston';
import config from '@/config';

import User from '@/models/user';

import type { Request, Response } from 'express';
import type { IUser } from '@/models/user';
import { generatePasswordResetToken } from '@/lib/jwt';
import nodemailerTransport from '@/lib/nodemailer';

import { resetLinkTemplate } from '@/mailTemplate/resetLink';

type RequestBody = Pick<IUser, 'email'>;

const forgetPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body as RequestBody;

  try {
    // Get password reset token
    const passwordResetToken = generatePasswordResetToken({ email });

    const user = await User.findOne({ email })
      .select('name passwordResetToken')
      .exec();

    if (!user) {
      return;
    }

    await nodemailerTransport.sendMail({
      from: '"route.io" <anoop9569110314@gmail.com>',
      to: email,
      subject: 'Password Reset Request',
      html: resetLinkTemplate({
        name: user.name,
        resetLink: `${config.CLIENT_ORIGIN}/reset-password?token=${passwordResetToken}`,
      }),
    });

    user.passwordResetToken = passwordResetToken;
    await user.save();

    res.sendStatus(204);
  } catch (error) {

    res.status(500).json({
      code: 'ServerError',
      message: 'Server Internal Errror',
    });
  }
};

export default forgetPassword;
