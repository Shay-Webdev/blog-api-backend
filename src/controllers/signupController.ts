import * as db from "../models/queries.js";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../models/errors.js";
import { sendSuccess } from "../utils/response.js";
import { IRefreshToken, TUser } from "../types/types.js";
import bcrypt from "bcryptjs";
import { IUserRequestBody } from "../types/request.js";
import { validationResult } from "express-validator";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { signupValidation } from "../validation/signupValidation.js";
import { generateRefreshToken, generateToken } from "../utils/jwt.js";

const createUserFunction = asyncHandler(async function (
  req: Request<{}, {}, Omit<IUserRequestBody, "id">>,
  res: Response,
  next: NextFunction,
) {
  // console.log('req body in createUser', req.body);
  // const reqUser = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    console.log(`errors in  createUser validation`, errors.array());

    if (
      errorMessages.includes("Username is required") ||
      errorMessages.includes("Email is required") ||
      errorMessages.includes("Password is required")
    ) {
      console.log("errors in  createUser validation/missing input");

      throw new AppError("Missing input", 400, "missing_field", errors.array());
    } else if (
      errorMessages.includes("Password must be at least 8 characters long") ||
      errorMessages.includes("Name must be at least 3 characters long")
    ) {
      console.log("errors in  createUser validation/invalid input");
      throw new AppError("Invalid input", 400, "invalid_field", errors.array());
    } else if (errorMessages.includes("Email already exists")) {
      console.log("errors in  createUser validation/duplicate resource");
      throw new AppError(
        "Resource trying to create already exists",
        409,
        "duplicate_resource",
        errors.array(),
      );
    }
    throw new AppError(
      "Internal server error",
      500,
      "internal_server_error",
      errors.array(),
    );
  } else {
    console.log("req body in createUser/signup", req.body);
    console.log("req query in createUser/signup", req.query);
    console.log("req params in createUser/signup", req.params);

    const parsedUser: Omit<TUser, "id"> = {
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
      isAuthor: req.body.isAuthor === "true" ? true : false,
    };

    const createdUser = await db.createUser(parsedUser);
    console.log("createdUser in signup", createdUser);

    const token = await generateToken(createdUser);
    const refreshToken = await generateRefreshToken(createdUser);
    const expireTime = 7 * 24 * 60 * 60 * 1000;
    const expireDate = new Date(Date.now() + expireTime);
    if (!token || !refreshToken) {
      throw new AppError(
        "Internal server error",
        500,
        "internal_server_error",
        { token, error: "token sign failed" },
      );
    }
    const refreshTokenObj: Pick<
      IRefreshToken,
      "userId" | "token" | "expiresAt"
    > = {
      userId: createdUser.id,
      token: refreshToken,
      expiresAt: expireDate,
    };
    const refreshTokenInDb = await db.createRefreshToken(refreshTokenObj);

    sendSuccess(
      res,
      { user: createdUser, token, refreshToken },
      201,
      "User created successfully",
    );
  }
});
const createUser = [signupValidation, createUserFunction];

export { createUser };
