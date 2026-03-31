import { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser } from '../services/authService';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name } = req.body;
    const result = await registerUser(email, password, name);
    res.status(201).json(result);
  } catch (error: any) {
    if (error.message === 'User already exists') {
      res.status(400).json({ message: error.message });
      return;
    }
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);
    res.status(200).json(result);
  } catch (error: any) {
    if (error.message === 'Invalid credentials') {
      res.status(401).json({ message: error.message });
      return;
    }
    next(error);
  }
};
