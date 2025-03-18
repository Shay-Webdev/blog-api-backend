import express from 'express';
import('dotenv/config');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'Hello World' });
});

app.listen(process.env.PORT || 3000, () =>
  console.log('Server is running on port 3000')
);
