import compression from 'compression';
import cors from 'cors';
import express from 'express';
import { noCache } from 'helmet';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import Todo from './entity/Todo';

const PORT = process.env.PORT || 5000;

const start = async (): Promise<void> => {
  try {
    const connection = await createConnection();
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
      const todos = await connection.manager.find(Todo);
      res.send(todos);
    });
    // eslint-disable-next-line
    app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
  } catch (err) {
    // eslint-disable-next-line
    console.log(err);
  }
};
start();
