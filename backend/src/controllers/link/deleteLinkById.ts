import type { Request, Response } from 'express';

import Link from '@/models/links';

const deleteLinkById = async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId;

  const { linkId } = req.params;

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

    await Link.deleteOne({ _id: linkId });

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Server Internal Errror',
    });
  }
};

export default deleteLinkById;
