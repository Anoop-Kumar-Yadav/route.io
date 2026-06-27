import Link from '@/models/links';

import type { Request, Response } from 'express';

import type { RequestQuery, LinkField } from '@/types';
import type { SortOrder } from 'mongoose';
import { generateNextPageLinks, generatePrevPageLink } from '@/utils';

const getMyLinks = async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId;

  const {
    search = '',
    sortby = 'createdAt_desc',
    offset = 0,
    limit = 100,
  } = req.query as RequestQuery;

  const searchRegex = new RegExp(`\\b${search}\\b`, 'gi');

  const [sortField, sortOrder] = sortby.split('_') as [LinkField, SortOrder];

  try {
    const links = await Link.find({ creator: userId })
      .where('title', searchRegex)
      .sort({ [sortField]: sortOrder })
      .select('-__v')
      .skip(offset)
      .limit(limit)
      .lean()
      .exec();

    const total = await Link.countDocuments({ creator: userId })
      .where('title', searchRegex)
      .exec();

    // Next page
    const nextLink = generateNextPageLinks({
      baseUrl: req.baseUrl,
      search,
      sortby,
      offset: Number(offset),
      limit: Number(limit),
      total,
    });

    // Previous page
    const prevLink = generatePrevPageLink({
      baseUrl: req.baseUrl,
      search,
      sortby,
      offset: Number(offset),
      limit: Number(limit),
    });

    res.status(200).json({
      total,
      offset: Number(offset),
      limit: Number(limit),
      next: nextLink,
      prev: prevLink,
      links,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Server Internal Errror',
    });
  }
};

export default getMyLinks;
