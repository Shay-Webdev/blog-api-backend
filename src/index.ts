import express, { Request, Response, NextFunction } from 'express';
import('dotenv/config');
import indexRoute from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { AppError } from './models/errors.js';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', indexRoute);
app.all('*', (req: Request, res: Response) => {
  throw new AppError(`Route ${req.originalUrl} not found`, 404);
});
app.use(errorHandler);

app.listen(process.env.PORT || 3000, () =>
  console.log('Server is running on port 3000')
);
