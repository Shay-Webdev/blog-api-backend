import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import * as db from '../models/queries.js';

const signupValidation = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters long')
    .escape(),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email')
    .normalizeEmail()
    .custom(async (email) => {
      const user = await db.getUserByEmail(email);
      if (user) {
        throw new Error('Email already exists');
      }
    }),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .escape(),
  body('isAuthor').trim().optional(),
];

export { signupValidation };
