import compression from 'compression';
import cors from 'cors';
import express from 'express';
import { noCache } from 'helmet';

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(noCache());
app.use(compression());
app.get('/', (req, res) => {
  const hello = 'world test';
  if (process.env.DEVELOPMENT) {
    const requestId = req.header('x-request-id');
    // eslint-disable-next-line
    console.log(`${requestId}: ${hello}`);
  }
  res.send({ hello });
});
// eslint-disable-next-line
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));``
