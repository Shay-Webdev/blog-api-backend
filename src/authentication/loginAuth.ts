import * as db from '../models/queries.js';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import { Strategy as LocalStrategy } from 'passport-local';
import { TErrorMessage, TUser } from '../types/types.js';
import { IReqUser, IUser } from '../types/request.js';
import { Application } from 'express';
import { error } from 'console';

const configurePassport = (app: Application) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async function (email, password, done) {
        try {
          const user = await db.getUserByEmail(email);
          if (!user) {
            console.error('user not found in localStrategy:');

            return done(null, false, {
              message: 'Resource or Route not found' as TErrorMessage,
            });
          } else {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
              return done(null, user);
            } else {
              console.error('invalid credentials in localStrategy:');

              return done(null, false, {
                message: 'Invalid credentials' as TErrorMessage,
              });
            }
          }
        } catch (err) {
          console.error('error in localStrategy:');

          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user: IUser, done) => {
    if (user.password) {
      delete user.password;
    }
    console.log('user in serializeUser after deleting password', user);

    done(null, user.id);
  });

  passport.deserializeUser(async (userId: number, done) => {
    try {
      const user = await db.getUserById(userId);
      if (user) {
        console.log('user in deserializeUser', user);
        return done(null, user);
      }
    } catch (err) {
      return done(err);
    }
  });
  app.use(passport.initialize());
};

// passport.initialize();
export default configurePassport;
