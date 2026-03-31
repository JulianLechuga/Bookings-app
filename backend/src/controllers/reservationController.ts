import { Request, Response, NextFunction } from 'express';
import { getBusinessByAlias, createReservation, getOwnerReservations, getAllBusinesses, getBookedSlots, cancelReservation } from '../services/reservationService';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getPublicBusinessesList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const businesses = await getAllBusinesses();
    res.json(businesses);
  } catch (error) {
    next(error);
  }
};

export const getAvailability = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { alias } = req.params;
    const dateStr = req.query.date as string;
    
    if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      res.status(400).json({ message: 'A valid date string (YYYY-MM-DD) is required as a query parameter.' });
      return;
    }

    const bookedSlots = await getBookedSlots(alias, dateStr);
    res.json(bookedSlots);
  } catch (error: any) {
    if (error.message === 'Business not found') {
      res.status(404).json({ message: error.message });
      return;
    }
    next(error);
  }
};

export const getPublicBusiness = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const business = await getBusinessByAlias(req.params.alias);
    res.json(business);
  } catch (error: any) {
    if (error.message === 'Business not found') {
      res.status(404).json({ message: error.message });
      return;
    }
    next(error);
  }
};

export const bookPublic = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { alias } = req.params;
    const { clientName, clientEmail, startTime, endTime } = req.body;
    
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
      res.status(400).json({ message: 'Invalid datetime format' });
      return;
    }

    const business = await getBusinessByAlias(alias);
    const reservation = await createReservation(business.id, clientName, clientEmail, start, end);
    res.status(201).json(reservation);
  } catch (error: any) {
    if (error.message === 'This time slot is already booked' || error.message === 'Business not found') {
      res.status(400).json({ message: error.message });
      return;
    }
    next(error);
  }
};

export const getMyReservations = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const reservations = await getOwnerReservations(req.user.userId);
    res.json(reservations);
  } catch (error) {
    next(error);
  }
};

export const cancelAppt = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const reservation = await cancelReservation(req.params.id, req.user.userId);
    res.json(reservation);
  } catch (error) {
    next(error);
  }
};
