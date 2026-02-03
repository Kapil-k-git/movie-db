import jwt from 'jsonwebtoken';
import type { JwtPayload } from './types';

const mustGetSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not set');
  }
  return secret;
};

export const signToken = (payload: JwtPayload) =>
  jwt.sign(payload, mustGetSecret(), { expiresIn: '1h' });

export const verifyToken = (token: string) =>
  jwt.verify(token, mustGetSecret()) as JwtPayload;

