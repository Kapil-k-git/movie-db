import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { signToken } from '../utils/jwt';
import { users } from '../utils/users';

export const login = async (req: Request, res: Response): Promise<void> => {
  const email = String(req.body?.email || '').trim();
  const password = String(req.body?.password || '');

  if (!email || !password) {
    res.status(400).json({ message: 'email and password are required' });
    return;
  }

  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  const token = signToken({
    sub: user.id,
    email: user.email,
    role: user.role
  });

  res.status(200).json({ token });
};
