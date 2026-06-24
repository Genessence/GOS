import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';

export const authorize = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user || !user.role) return res.status(403).json({ message: 'Forbidden' });

    if (!roles.includes(user.role)) return res.status(403).json({ message: 'Insufficient role' });
    next();
  };
};
