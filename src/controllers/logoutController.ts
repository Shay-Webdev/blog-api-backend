import * as db from '../models/queries.js';
import { Response, NextFunction } from 'express';
import { IReqUser } from '../types/request.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { AppError } from '../models/errors.js';
import { TUser } from '../types/types.js';
import { sendSuccess } from '../utils/response.js';

const logout = asyncHandler(
  (req: IReqUser, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError('Authentication required', 401, 'access_denied', {
        error: 'no user in logout',
      });
    }

    const refreshToken = req.body.refreshTokens as string | undefined;
    const user = req.user as TUser;

    if (!refreshToken) {
      throw new AppError('Authentication required', 401, 'access_denied', {
        error: 'no refresh token in logout',
      });
    }
    const deletedRefreshToken = db.deleteRefreshTokenByUserID(user.id);
    sendSuccess(res, { deletedRefreshToken }, 200, 'Logged out successfully');
  }
);

export { logout };
