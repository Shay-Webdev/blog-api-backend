import * as db from '../models/queries.js';
import jwt, { Algorithm } from 'jsonwebtoken';
import { TUser, IJwtPayload } from '../types/types.js';
import dotenv from 'dotenv';
dotenv.config();

const generateToken = (user: TUser) => {
  const payload: IJwtPayload = {
    sub: user.id.toString(),
    email: user.email,
    username: user.username,
    isAuthor: user.isAuthor,
  };

  const secret = process.env.JWT_SECRET as string;
  const options: jwt.SignOptions = {
    algorithm: process.env.JWT_ALGORITHM as Algorithm,
    expiresIn: '1m',
  };
  const token = jwt.sign(payload, secret, options);
  return token;
};

const generateRefreshToken = (user: TUser) => {
  const payload: IJwtPayload = {
    sub: user.id.toString(),
    email: user.email,
    username: user.username,
    isAuthor: user.isAuthor,
  };

  const deletedRefreshTokens = db.deleteRefreshTokenByUserID(user.id);
  const secret = process.env.JWT_REFRESH_SECRET as string;
  const options: jwt.SignOptions = {
    algorithm: process.env.JWT_ALGORITHM as Algorithm,
    expiresIn: '7d',
  };
  const token = jwt.sign(payload, secret, options);
  return token;
};

export { generateToken, generateRefreshToken };
