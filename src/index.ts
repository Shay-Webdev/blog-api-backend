import express, { Request, Response, NextFunction } from 'express';
import('dotenv/config');
import indexRoute from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { AppError } from './models/errors.js';
import configurePassport from './authentication/loginAuth.js';
import { scheduledTokenCleanup } from './utils/cleanExpiredTokens.js';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
configurePassport(app);
app.use('/', indexRoute);
app.all('*', (req: Request, res: Response) => {
  throw new AppError(`Resource or Route not found`, 404, 'not_found', {
    error: `invalid route: ${req.originalUrl}`,
  });
});
scheduledTokenCleanup();
app.use(errorHandler);

app.listen(process.env.PORT || 3000, () =>
  console.log('Server is running on port 3000')
);
