import { Router } from "express";
import * as tokenController from "../controllers/tokenController.js";
const router = Router();
router.route("/refresh").post(tokenController.refreshToken);
export default router;
//# sourceMappingURL=tokenRoutes.js.map