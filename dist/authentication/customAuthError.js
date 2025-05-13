import passport from "passport";
import { AppError } from "../models/errors.js";
const customLocalAuth = (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (info) {
            throw new AppError(info.message, 404, "not_found", info); // return res.status(401).json({ message: info.message });
        }
        if (!user) {
            throw new AppError("Access denied", 401, "auth_failed"); // return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = user;
        next();
    })(req, res, next);
};
const customJwtAuth = (req, res, next) => {
    passport.authenticate("jwt", (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (info) {
            throw new AppError(info.message, 401, "auth_failed", info);
        }
        if (!user) {
            throw new AppError("Access denied", 401, "auth_failed");
        }
        req.user = user;
        next();
    })(req, res, next),
        {
            session: false,
        };
};
const loginJwtAuth = (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
        if (err)
            return next(err);
        if (info) {
            throw new AppError(info.message, 401, "auth_failed", info);
        }
        if (user)
            req.user = user; // Set req.user if JWT is valid
        next();
    })(res, req, next);
};
export { customLocalAuth, customJwtAuth, loginJwtAuth };
//# sourceMappingURL=customAuthError.js.map