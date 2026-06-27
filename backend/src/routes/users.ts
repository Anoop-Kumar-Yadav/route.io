import { Router } from 'express';
import { body } from 'express-validator';
import bcrypt from 'bcrypt';

import validationError from '@/middlewares/validationError';
import expressRateLimit from '@/lib/expressRateLimit';
import authorization from '@/middlewares/authorization';

import authentication from '@/middlewares/authentication';

import User from '@/models/user';

import getCurrentUser from '@/controllers/user/getCurrentUser';
import deleteCurrentUser from '@/controllers/user/deleteCurrentUser';
import updateCurrentUser from '@/controllers/user/updateCurrentUser';

const router = Router();

router.get(
  '/current',
  expressRateLimit('basic'),
  authentication,
  authorization(['admin', 'user']),
  getCurrentUser,
);

router.delete(
  '/current',
  expressRateLimit('basic'),
  authentication,
  authorization(['user', 'admin']),
  deleteCurrentUser,
);

router.patch(
  '/current',
  expressRateLimit('basic'),
  authentication,
  authorization(['user', 'admin']),
  body('name').optional(),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Invalid email address')
    .custom(async (email) => {
      const isDuplicate = await User.exists({ email }).exec();

      if (isDuplicate) {
        throw new Error('The email is already in use');
      }
    }),
  body('current_password')
    .optional()
    .custom(async (currentPassword, { req }) => {
      const userId = req.userId;

      const user = await User.findById(userId).select('password').lean().exec();

      if (!user) {
        return;
      }

      const passwordIsValid = await bcrypt.compare(
        currentPassword,
        user.password,
      );

      if (!passwordIsValid) {
        throw new Error('Current password is wrong');
      }
    }),

  body('new_password')
    .optional()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 character long'),
  body('role')
    .optional()
    .custom(() => {
      throw new Error('YOu do not have permission to change role');
    }),
  validationError,
  updateCurrentUser,
);
export default router;
