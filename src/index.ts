import express from 'express';
import('dotenv/config');
import indexRoute from './routes/index.js';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', indexRoute);

app.listen(process.env.PORT || 3000, () =>
  console.log('Server is running on port 3000')
);
