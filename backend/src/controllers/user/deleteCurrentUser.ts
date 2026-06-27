import { logger } from '@/lib/winston';
import Link from '@/models/links';

import User from '@/models/user';

import { Request, Response } from 'express';

const deleteCurrentUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.userId;

  try {
    await Link.deleteMany({ creator: userId });

    await User.deleteOne({ _id: userId });

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Server Internal Errror',
    });
  }
};

export default deleteCurrentUser;
