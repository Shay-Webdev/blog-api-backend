import * as db from "../models/queries.js";
import jwt, { Algorithm, JwtPayload, VerifyOptions } from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { IReqUser } from "../types/request.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { AppError } from "../models/errors.js";
import { sendSuccess } from "../utils/response.js";
import { generateToken } from "../utils/jwt.js";
import { IJwtPayload, TUser } from "../types/types.js";

const refreshToken = asyncHandler(
  async (req: IReqUser, res: Response, next: NextFunction) => {
    console.log("req user in refresh token controller: ", req.user);
    console.log("req body in refresh token controller: ", req.body);
    //    console.log("req in refresh token controller: ", req);

    // if (!req.user) {
    //   throw new AppError('Authentication required', 401, 'unauthorized', {
    //     error: 'user not authenticated in refresh token',
    //   });
    // }

    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
      throw new AppError("Missing input", 401, "token_missing");
    }
    const refreshTokenInDb = await db.getRefreshToken(refreshToken);
    if (!refreshTokenInDb) {
      throw new AppError("Access denied", 403, "access_denied", {
        error: "invalid refresh token",
      });
    }

    const refreshSecret = process.env.JWT_REFRESH_SECRET as string;
    const user = req.user as IJwtPayload;
    const algorithm = [process.env.JWT_ALGORITHM] as Algorithm[];
    let verifiedPayload: JwtPayload | string;
    try {
      verifiedPayload = jwt.verify(refreshToken, refreshSecret, {
        algorithms: algorithm,
      });
    } catch (error) {
      throw new AppError("Invalid token", 401, "unauthorized", {
        error: "error in refresh token verification/token controller",
        errorSource: error,
      });
    }

    if (typeof verifiedPayload === "string" || !verifiedPayload) {
      throw new AppError("Invalid token", 401, "unauthorized", {
        error: "error in verified payload check",
      });
    }
    const accessTokenPayload: TUser = {
      id: Number(verifiedPayload.sub),
      email: verifiedPayload.email,
      isAuthor: verifiedPayload.isAuthor,
      password: verifiedPayload.password,
      username: verifiedPayload.username,
    };
    console.log(
      "verified payload in refresh token controller: ",
      verifiedPayload,
      accessTokenPayload,
    );

    const token = generateToken(accessTokenPayload);

    sendSuccess(
      res,
      { user: req.user, token, refreshToken },
      200,
      "Token refreshed successfully",
    );
  },
);

export { refreshToken };
