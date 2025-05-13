import * as db from "../models/queries.js";
import passport from "passport";
import bcrypt from "bcryptjs";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt, } from "passport-jwt";
import dotenv from "dotenv";
dotenv.config();
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
    algorithms: ["HS256"],
};
const jwtVerifyFunction = async (payload, done) => {
    try {
        // const user = await db.getUserById(Number(payload.sub));
        // if (user) {
        //   console.error('user found in jwtVerifyFunction:', user);
        //   return done(null, user);
        // } else {
        //   console.error('user not found in jwtVerifyFunction:', user);
        //   return done(null, false, {
        //     message: 'Resource or Route not found' as TErrorMessage,
        //   });
        // }
        console.log(`payload in jwt verify fn in loginauth: `, payload);
        return done(null, payload);
    }
    catch (err) {
        console.error("error in jwtVerifyFunction:", err);
        return done(err);
    }
};
const configurePassport = (app) => {
    passport.use(new LocalStrategy({
        usernameField: "email",
        passwordField: "password",
    }, async function (email, password, done) {
        try {
            const user = await db.getUserByEmail(email);
            if (!user) {
                console.error("user not found in localStrategy:");
                return done(null, false, {
                    message: "Resource or Route not found",
                });
            }
            else {
                const isMatch = await bcrypt.compare(password, user.password);
                if (isMatch) {
                    return done(null, user);
                }
                else {
                    console.error("invalid credentials in localStrategy:");
                    return done(null, false, {
                        message: "Invalid credentials",
                    });
                }
            }
        }
        catch (err) {
            console.error("error in localStrategy:");
            return done(err);
        }
    }));
    passport.use(new JwtStrategy(jwtOptions, jwtVerifyFunction));
    passport.serializeUser((user, done) => {
        if (user.password) {
            delete user.password;
        }
        console.log("user in serializeUser after deleting password", user);
        done(null, user.id);
    });
    passport.deserializeUser(async (userId, done) => {
        try {
            const user = await db.getUserById(userId);
            if (user) {
                console.log("user in deserializeUser", user);
                return done(null, user);
            }
        }
        catch (err) {
            return done(err);
        }
    });
    app.use(passport.initialize());
};
// passport.initialize();
export default configurePassport;
//# sourceMappingURL=loginAuth.js.map