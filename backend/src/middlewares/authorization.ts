import { Request, Response, NextFunction } from 'express';
import config from '@/config';
import { logger } from '@/lib/winston';

import User from '@/models/user';

type Role = 'user' | 'admin';

const authorization = (role: Role[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const userId = req.userId;

    try {
      const user = await User.findById(userId).select('role').lean().exec();

      if (!user) {
        res.status(403).json({
          code: 'AuthorizationError',
          message: 'You dont have an account, please register to get access',
        });
        return;
      }

      if (!role.includes(user.role)) {
        res.status(403).json({
          code: 'AuthorizationError',
          message: 'Unauthorized access',
        });
        return;
      }

      next();
    } catch (error) {
      res.status(500).json({
        code: 'ServerError',
        message: 'Server Internal Errror',
      });
    }
  };
};

export default authorization;
