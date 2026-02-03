export type UserRole = 'admin' | 'user';

export type User = {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
};

export type JwtPayload = {
  sub: string;
  email: string;
  role: UserRole;
};

declare global {
  namespace Express {
    interface Request {
      auth?: JwtPayload;
    }
  }
}

