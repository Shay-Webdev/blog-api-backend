import express from "express";
import("dotenv/config");
import cors from "cors";
import indexRoute from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { AppError } from "./models/errors.js";
import configurePassport from "./authentication/loginAuth.js";
import { scheduledTokenCleanup } from "./utils/cleanExpiredTokens.js";
const app = express();
const clientURLUser = process.env.CLIENT_URL_USER;
const clientURLAuthor = process.env.CLIENT_URL_AUTHOR;
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) {
            return callback(null, true);
        }
        if (origin === clientURLAuthor ||
            origin === clientURLUser ||
            "http://localhost:5173") {
            return callback(null, true);
        }
        return callback(new Error("CORS error: unauthorized origin"));
    },
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
configurePassport(app);
app.use("/", indexRoute);
app.all("*", (req, res) => {
    console.log("original url in reqest in route not found: ", req.originalUrl);
    throw new AppError(`Resource or Route not found`, 404, "not_found", {
        error: `invalid route: ${req.originalUrl}`,
    });
});
scheduledTokenCleanup();
app.use(errorHandler);
app.listen(process.env.PORT || 3000, () => console.log("Server is running on port 3000"));
//# sourceMappingURL=index.js.map