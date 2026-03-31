import { Request, Response, NextFunction } from 'express';
import { updateProfile } from '../services/profileService';
import { AuthRequest } from '../middlewares/authMiddleware';

export const update = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.userId;
    const { name, businessName, businessType, alias, openTime, closeTime, slotDuration } = req.body;
    let finalSlotDuration = slotDuration ? parseInt(slotDuration) || 60 : undefined;
    const updatedUser = await updateProfile(userId, { name, businessName, businessType, alias, openTime, closeTime, slotDuration: finalSlotDuration });
    res.json(updatedUser);
  } catch (error: any) {
    if (error.message === 'Alias already taken') {
      res.status(400).json({ message: error.message });
      return;
    }
    next(error);
  }
};
