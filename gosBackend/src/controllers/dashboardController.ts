import { Request, Response } from 'express';

export const adminDashboard = (_req: Request, res: Response) => {
  res.json({ message: 'Welcome to Admin Dashboard' });
};

export const managerDashboard = (_req: Request, res: Response) => {
  res.json({ message: 'Welcome to Manager Dashboard' });
};

export const employeeDashboard = (_req: Request, res: Response) => {
  res.json({ message: 'Welcome to Employee Dashboard' });
};

export const userDashboard = (_req: Request, res: Response) => {
  res.json({ message: 'Welcome to User Dashboard' });
};
