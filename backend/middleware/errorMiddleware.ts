import type { Request, Response } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response
): void => {
  console.error('❌ Error:', err.message);

  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};
