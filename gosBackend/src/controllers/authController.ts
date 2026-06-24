import { Request, Response } from 'express';
import * as authService from '../services/authService';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await authService.registerUser(name, email, password, role || 'User');
    res.status(201).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err: any) {
    res.status(400).json({ message: err.message || 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const jwtSecret = process.env.JWT_SECRET || '';
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1h';
    const result = await authService.loginUser(email, password, jwtSecret, jwtExpiresIn);
    res.json(result);
  } catch (err: any) {
    res.status(401).json({ message: err.message || 'Login failed' });
  }
};

export const logout = async (_req: Request, res: Response) => {
  // Stateless JWT logout: client should discard token. Optionally implement blacklist.
  res.json({ message: 'Logged out' });
};
