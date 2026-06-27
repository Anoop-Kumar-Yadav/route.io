import { Request, Response } from 'express';

import { Router } from 'express';
import { body, query, param } from 'express-validator';

import expressRateLimit from '@/lib/expressRateLimit';

import authentication from '@/middlewares/authentication';
import authorization from '@/middlewares/authorization';
import validationError from '@/middlewares/validationError';
import createShortLink from '@/controllers/link/createShortLink';

import Link from '@/models/links';
import getMyLinks from '@/controllers/link/getMyLinks';
import updateLinkById from '@/controllers/link/updateLinkById';
import deleteLinkById from '@/controllers/link/deleteLinkById';

const router = Router();

router.post(
  '/generate',
  expressRateLimit('basic'),
  authentication,
  authorization(['user', 'admin']),
  body('title').notEmpty().withMessage('Title is required'),
  body('destination')
    .notEmpty()
    .withMessage('Destination is required')
    .isURL()
    .withMessage('Invalid URL'),
  body('backHalf')
    .optional()
    .trim()
    .custom(async (backHalf) => {
      const backHalfExist = await Link.exists({ backHalf }).exec();

      if (backHalfExist) {
        throw new Error('backHalf is already in use');
      }
    }),
  validationError,
  createShortLink,
);

router.get(
  '/my-links',
  expressRateLimit('basic'),
  authentication,
  authorization(['user', 'admin']),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be berween 1 and 100'),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset must be positive number'),
  validationError,
  getMyLinks,
);

router.patch(
  '/:linkId',
  expressRateLimit('basic'),
  authentication,
  authorization(['user', 'admin']),
  param('linkId').isMongoId().withMessage('Invalid ID'),
  body('title').optional(),
  body('destination')
    .notEmpty()
    .withMessage('Destination is required')
    .isURL()
    .withMessage('Invalid URL'),
  body('backHalf')
    .optional()
    .trim()
    .custom(async (backHalf) => {
      const backHalfExist = await Link.exists({ backHalf }).exec();

      if (backHalfExist) {
        throw new Error('backHalf is already in use');
      }
    }),
  validationError,
  updateLinkById,
);

router.delete(
  '/:linkId',
  expressRateLimit('basic'),
  authentication,
  authorization(['user', 'admin']),
  param('linkId').isMongoId().withMessage('Invalid ID'),
  validationError,
  deleteLinkById,
);
export default router;
