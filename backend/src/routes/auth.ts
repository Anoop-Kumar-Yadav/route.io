import { Router } from 'express';

import { body } from 'express-validator';
import bcrypt from 'bcrypt';

// Custom Modules
import expressRateLimit from '@/lib/expressRateLimit';

// Controllers
import register from '@/controllers/auth/register';
import login from '@/controllers/auth/login';
import logout from '@/controllers/auth/logout';
import refreshToken from '@/controllers/auth/refreshToken';
import forgetPassword from '@/controllers/auth/forgetPassword';

// Middlewares
import validationError from '@/middlewares/validationError';
import authentication from '@/middlewares/authentication';

import User from '@/models/user';
import resetPassword from '@/controllers/auth/resetPassword';

const router = Router();

router.post(
  '/register',
  expressRateLimit('passReset'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email is invalid')
    .custom(async (value) => {
      const userExist = await User.exists({ email: value }).exec();
      if (userExist) {
        throw new Error('This email already exists');
      }
      return true;
    }),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 character long'),
  body('role')
    .trim()
    .notEmpty()
    .withMessage('Role is required')
    .isIn(['user', 'admin'])
    .withMessage('Role is not support'),
  validationError,
  register,
);

router.post(
  '/login',
  expressRateLimit('auth'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid Email')
    .custom(async (email) => {
      const user = await User.exists({ email }).exec();

      if (!user) {
        throw new Error('User not found');
      }
    }),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .custom(async (password, { req }) => {
      const { email } = req.body;

      const user = await User.findOne({ email })
        .select('password')
        .lean()
        .exec();

      if (!user) {
        return;
      }

      const passwordIsValid = await bcrypt.compare(password, user.password);

      if (!passwordIsValid) {
        throw new Error('Invalid Password');
      }
    }),
  validationError,
  login,
);

router.delete('/logout', expressRateLimit('basic'), authentication, logout);

router.get('/refresh-token', expressRateLimit('basic'), refreshToken);

router.post(
  '/forget-password',
  expressRateLimit('basic'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid Email')
    .custom(async (email) => {
      const userExists = await User.exists({ email }).exec();

      if (!userExists) {
        throw new Error('NO user found with this email.');
      }
    }),
  validationError,
  forgetPassword,
);

router.post(
  '/reset-password',
  expressRateLimit('passReset'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  validationError,
  resetPassword,
);
export default router;
