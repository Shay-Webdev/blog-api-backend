import * as db from "../models/queries.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const generateToken = (user) => {
    const payload = {
        sub: user.id.toString(),
        email: user.email,
        username: user.username,
        isAuthor: user.isAuthor,
    };
    const secret = process.env.JWT_SECRET;
    const options = {
        algorithm: process.env.JWT_ALGORITHM,
        expiresIn: "15m",
    };
    const token = jwt.sign(payload, secret, options);
    return token;
};
const generateRefreshToken = (user) => {
    const payload = {
        sub: user.id.toString(),
        email: user.email,
        username: user.username,
        isAuthor: user.isAuthor,
    };
    const deletedRefreshTokens = db.deleteRefreshTokenByUserID(user.id);
    const secret = process.env.JWT_REFRESH_SECRET;
    const options = {
        algorithm: process.env.JWT_ALGORITHM,
        expiresIn: "7d",
    };
    const token = jwt.sign(payload, secret, options);
    return token;
};
export { generateToken, generateRefreshToken };
//# sourceMappingURL=jwt.js.map