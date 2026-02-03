import type { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/jwt';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Missing Authorization header' });
    return;
  }

  const token = header.slice('Bearer '.length).trim();
  try {
    req.auth = verifyToken(token);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

