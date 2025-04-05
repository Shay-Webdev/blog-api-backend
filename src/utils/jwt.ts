import jwt, { Algorithm } from 'jsonwebtoken';
import { TUser, IJwtPayload } from '../types/types.js';
import dotenv from 'dotenv';
dotenv.config();

const generateToken = (user: IJwtPayload) => {
  const payload: IJwtPayload = {
    sub: user.id,
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

const generateRefreshToken = (user: IJwtPayload) => {
  const payload: IJwtPayload = {
    sub: user.id.toString(),
    email: user.email,
    username: user.username,
    isAuthor: user.isAuthor,
  };

  const secret = process.env.JWT_REFRESH_SECRET as string;
  const options: jwt.SignOptions = {
    algorithm: process.env.JWT_ALGORITHM as Algorithm,
    expiresIn: '7d',
  };
  const token = jwt.sign(payload, secret, options);
  return token;
};

export { generateToken, generateRefreshToken };
