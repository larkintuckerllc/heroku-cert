import compression from 'compression';
import cors from 'cors';
import express from 'express';
import { noCache } from 'helmet';
import { createClient } from 'redis';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import uuidv4 from 'uuid/v4';

import Todo from './entity/Todo';

const PORT = process.env.PORT || 5000;

// REDIS SETUP
const REDIS_TOKEN_PREFIX = 'token';
const { REDIS_URL } = process.env;
if (REDIS_URL === undefined) {
  // eslint-disable-next-line
  console.log('ERROR: REDIS_URL env variable missing');
  process.exit(1);
}
const redis = createClient({
  url: REDIS_URL,
});
redis.on('error', err => {
  // eslint-disable-next-line
  console.log(`ERROR: Redis error ${err}`);
  process.exit(1);
});
const setToken = (token: string): Promise<true> =>
  new Promise<true>((resolve, reject): void => {
    const key = `${REDIS_TOKEN_PREFIX}:${token}`;
    redis.set(key, 'true', err => {
      if (err !== null) {
        reject(err);
        return;
      }
      resolve(true);
    });
  });
const checkToken = (token: string): Promise<boolean> =>
  new Promise<boolean>((resolve, reject): void => {
    const key = `${REDIS_TOKEN_PREFIX}:${token}`;
    redis.get(key, (err, value) => {
      if (err !== null) {
        reject(err);
        return;
      }
      const check = value !== null;
      resolve(check);
    });
  });

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
      try {
        const todos = await connection.manager.find(Todo);
        res.send(todos);
      } catch (err) {
        res.status(500).send();
      }
    });
    app.get('/authenticate', async (req, res) => {
      const token = uuidv4();
      try {
        await setToken(token);
        res.send({ token });
      } catch (err) {
        res.status(500).send();
      }
    });
    app.get('/protected', async (req, res) => {
      const token = req.header('authorization');
      if (token === undefined) {
        res.status(401).send();
        return;
      }
      try {
        const check = await checkToken(token);
        if (!check) {
          res.status(401).send();
          return;
        }
        res.send({ secret: 'world' });
      } catch (err) {
        res.status(500).send();
      }
    });
    // eslint-disable-next-line
    app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
  } catch (err) {
    // eslint-disable-next-line
    console.log(`ERROR: Start ${err}`);
    process.exit(1);
  }
};
start();
