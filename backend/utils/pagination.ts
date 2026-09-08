import type { Request } from 'express';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface PaginationOptions {
  defaultLimit?: number;
  maxLimit?: number;
}

// Parse ?page=&limit= with sane bounds; returns skip/limit plus a meta builder
export const getPagination = (req: Request, { defaultLimit = 20, maxLimit = 100 }: PaginationOptions = {}) => {
  const page = Math.max(parseInt(String(req.query.page), 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(String(req.query.limit), 10) || defaultLimit, 1), maxLimit);

  return {
    page,
    limit,
    skip: (page - 1) * limit,
    meta: (total: number): PaginationMeta => ({
      page,
      limit,
      total,
      totalPages: Math.max(Math.ceil(total / limit), 1)
    })
  };
};
