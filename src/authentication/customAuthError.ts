import { Request, Response, NextFunction } from 'express';
import passport, { authenticate } from 'passport';
import { TUser } from '../types/types.js';
import { IReqUser } from '../types/request.js';

const customAuthError = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    'local',
    (err: unknown, user: TUser | false, info: Record<string, unknown>) => {
      if (err) {
        return next(err);
      }
      if (info) {
        return res.status(401).json({ message: info.message });
      }
      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      req.user = user;
    }
  )(req, res, next);
};

export { customAuthError };
