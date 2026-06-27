import type { GenLinkProps } from '@/types';
type GenPrevLinkProps = Omit<GenLinkProps, 'total'>;

import config from '@/config';
import mongoose from 'mongoose';

export const generateMongooseId = () => new mongoose.Types.ObjectId();

export const generateBackHalf = (length: number = 5): string => {
  const char: string =
    '123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

  let backHalf: string = '';

  for (let index = 0; index < length; index++) {
    backHalf += char[Math.floor(Math.random() * char.length)];
  }

  return backHalf;
};

export const generateNextPageLinks = ({
  baseUrl,
  search,
  sortby,
  offset = 1,
  limit = 100,
  total = 0,
}: GenLinkProps): string | null => {
  const origin =
    config.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://api.route.io.com';

  const url = new URL(`${origin}${baseUrl}/my-links`);
  const params = new URLSearchParams();

  if (search) {
    params.set('search', search);
  }

  if (sortby) {
    params.set('sortby', sortby);
  }

  params.set('offset', String(offset + limit > total ? total : offset + limit));
  params.set('limit', String(limit));

  url.search = params.toString();
  if (offset === total) {
    return null;
  }

  return url.toString();
};

export const generatePrevPageLink = ({
  baseUrl,
  search,
  sortby,
  offset = 0,
  limit = 100,
}: GenPrevLinkProps): string | null => {
  if (offset <= 0) {
    return null;
  }

  const origin =
    config.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://api.route.io.com';

  const url = new URL(`${origin}${baseUrl}/my-links`);
  const params = new URLSearchParams();

  if (search) {
    params.set('search', search);
  }

  if (sortby) {
    params.set('sortby', sortby);
  }

  params.set('offset', String(offset - limit <= 0 ? 0 : offset - limit));
  params.set('limit', String(limit));

  url.search = params.toString();

  return url.toString();
};
