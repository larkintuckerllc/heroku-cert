import compression from 'compression';
import cors from 'cors';
import express from 'express';
import { noCache } from 'helmet';
import knex from 'knex';

interface Todo {
  id: number;
  name: string;
}

const PORT = process.env.PORT || 5000;
const { DATABASE_URL } = process.env;

// KNEX SETUP
if (DATABASE_URL === undefined) {
  // eslint-disable-next-line
  console.log('ERROR: DATABASE_URL not supplied');
  process.exit(1);
}
const pg = knex({
  client: 'pg',
  connection: DATABASE_URL,
});

const app = express();
app.use(cors());
app.use(noCache());
app.use(compression());
app.get('/', (req, res) => {
  const hello = 'world';
  if (process.env.DEVELOPMENT) {
    const requestId = req.header('x-request-id');
    // eslint-disable-next-line
    console.log(`${requestId}: ${hello}`);
  }
  res.send({ hello });
});
app.get('/todos', async (req, res) => {
  try {
    const todos = await pg.select('id', 'name').from<Todo>('todos');
    res.send(todos);
  } catch (err) {
    // eslint-disable-next-line
    console.log('ERROR: todos query failed');
    res.status(500).send();
  }
});
// eslint-disable-next-line
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));``
