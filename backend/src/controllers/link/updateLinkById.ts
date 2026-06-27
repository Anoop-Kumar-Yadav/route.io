import { logger } from '@/lib/winston';

import Link from '@/models/links';

import type { Request, Response } from 'express';
import type { ILink } from '@/models/links';

type RequestBody = Pick<ILink, 'title' | 'destination' | 'backHalf'>;

const updateLinkById = async (req: Request, res: Response): Promise<void> => {
  const { linkId } = req.params;
  const userId = req.userId;

  const requestToUpdate = req.body as RequestBody;

  try {
    const isLinkAvailable = await Link.exists({ _id: linkId }).exec();

    if (!isLinkAvailable) {
      res.status(404).json({
        code: 'NotFound',
        message: 'This link is not available',
      });
      return;
    }

    const isLinkCreator = await Link.exists({
      _id: linkId,
      creator: userId,
    }).exec();

    if (!isLinkCreator) {
      res.status(404).json({
        code: 'AccessDenied',
        message: 'You dont have permission to modify this link',
      });
      return;
    }

    await Link.updateOne({ _id: linkId }, requestToUpdate);

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Server Internal Errror',
    });
  }
};

export default updateLinkById;
