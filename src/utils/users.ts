import type { User } from './types';
import bcrypt from 'bcryptjs'

export const users: User[] = [
  {
    id: 'u_admin',
    email: 'admin@example.com',
    // password: 'admin123'
    passwordHash: bcrypt.hashSync('admin123', 10),
    role: 'admin',
  },
  {
    id: 'u_user',
    email: 'user@example.com',
    // password: 'user123'
    passwordHash: bcrypt.hashSync('user123', 10),
    role: 'user',
  },
];

export const findUserByEmail = (email: string) =>
  users.find((u) => u.email.toLowerCase() === email.toLowerCase());

