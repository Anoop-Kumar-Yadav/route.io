import { logger } from '@/lib/winston';

import Link from '@/models/links';
import User from '@/models/user';

import type { Request, Response } from 'express';

const redirect = async (req: Request, res: Response): Promise<void> => {
  const { backHalf } = req.params;

  try {
    const backHalfExist = await Link.exists({ backHalf }).exec();

    if (!backHalfExist) {
      console.log('no');
      res.status(404).json({
        code: 'NotFound',
        message: 'Link not Found',
      });
      return;
    }

    const link = await Link.findById(backHalfExist._id)
      .select('destination creator totalVisitCount')
      .exec();

    if (!link) {
      return;
    }

    link.totalVisitCount++;
    await link.save();

    const user = await User.findById(link.creator)
      .select('totalVisitCount')
      .exec();

    if (!user) {
      return;
    }

    user.totalVisitCount++;
    await user.save();

    res.redirect(
      link.destination.startsWith('https://')
        ? link.destination
        : `http://${link.destination}`,
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      code: 'ServerError',
      message: 'Server Internal Errror',
    });
  }
};

export default redirect;
