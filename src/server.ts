import cors from 'cors';
import express from 'express';

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.get('/', (req, res) => {
  const hello = 'world';
  if (process.env.DEVELOPMENT) {
    // eslint-disable-next-line
    console.log(hello);
  }
  res.send({ hello });
});
// eslint-disable-next-line
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));``
