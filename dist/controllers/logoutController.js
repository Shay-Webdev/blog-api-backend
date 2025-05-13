import * as db from "../models/queries.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { AppError } from "../models/errors.js";
import { sendSuccess } from "../utils/response.js";
const logout = asyncHandler((req, res, next) => {
    console.log("refreshToken in logout:", req.body.refreshToken);
    if (!req.user) {
        throw new AppError("Authentication required", 401, "access_denied", {
            error: "no user in logout",
        });
    }
    //    const refreshToken = req.body.refreshToken as string | undefined;
    const user = req.user;
    console.log("user in logout:", user);
    //    if (!refreshToken) {
    //      throw new AppError("Authentication required", 401, "access_denied", {
    //        error: "no refresh token in logout",
    //      });
    //    }
    const deletedRefreshToken = db.deleteRefreshTokenByUserID(user.id);
    sendSuccess(res, { deletedRefreshToken }, 200, "Logged out successfully");
});
export { logout };
//# sourceMappingURL=logoutController.js.map