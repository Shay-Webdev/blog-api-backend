import { Request, Response, NextFunction } from 'express';
import passport, { authenticate } from 'passport';
import { TErrorMessage, TUser } from '../types/types.js';
import { IReqUser } from '../types/request.js';
import { AppError } from '../models/errors.js';

const customAuthError = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    'local',
    (err: unknown, user: TUser | false, info: Record<string, unknown>) => {
      if (err) {
        return next(err);
      }
      if (info) {
        throw new AppError(
          info.message as TErrorMessage,
          401,
          'auth_failed',
          info
        ); // return res.status(401).json({ message: info.message });
      }
      if (!user) {
        throw new AppError('Access denied', 401, 'auth_failed'); // return res.status(401).json({ message: 'Unauthorized' });
      }
      req.user = user;
      next();
    }
  )(req, res, next);
};

export { customAuthError };
