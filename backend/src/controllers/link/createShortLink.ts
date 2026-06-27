import { logger } from '@/lib/winston';
import config from '@/config';

import type { Request, Response } from 'express';

import type { ILink } from '@/models/links';
import Link from '@/models/links';
import { generateBackHalf } from '@/utils';

type RequestBody = Pick<ILink, 'title' | 'destination' | 'backHalf'>;
const createShortLink = async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId;

  const {
    title,
    destination,
    backHalf = generateBackHalf(),
  } = req.body as RequestBody;

  try {
    const link = await Link.create({
      title,
      destination,
      backHalf,
      shortLink: `${config.CLIENT_ORIGIN}/${backHalf}`,
      creator: userId,
    });

    res.status(200).json({
      link,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Server Internal Errror',
    });
  }
};

export default createShortLink;
