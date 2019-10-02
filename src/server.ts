import compression from 'compression';
import cors from 'cors';
import express from 'express';
import fs from 'fs';
import { noCache } from 'helmet';
import knex from 'knex';
import https from 'https';
import pg from 'pg';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import uuidv4 from 'uuid/v4';
import Todo from './entity/Todo';
import oauth2 from './oauth2';
import { getValue, setValue } from './redis';
import { DEFAULT_PORT, REDIS_TOKEN_PREFIX } from './constants';
import { DATABASE_URL, DEVELOPMENT, LOCALHOST } from './env';

const PORT = process.env.PORT || DEFAULT_PORT;

if (LOCALHOST !== undefined) {
  pg.defaults.ssl = true;
}
const pgClient = knex({
  client: 'pg',
  connection: DATABASE_URL,
});

const start = async (): Promise<void> => {
  try {
    const connection = await createConnection();
    const app = express();
    app.use(cors());
    app.use(noCache());
    app.use(compression());
    app.use('/oauth2', oauth2);
    app.get('/', (req, res) => {
      const hello = 'world';
      if (DEVELOPMENT) {
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
        await setValue(`${REDIS_TOKEN_PREFIX}:${token}`, 'true');
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
        const check = await getValue(`${REDIS_TOKEN_PREFIX}:${token}`);
        if (check === null) {
          res.status(401).send();
          return;
        }
        res.send({ secret: 'world' });
      } catch (err) {
        res.status(500).send();
      }
    });
    app.get('/contacts', async (req, res) => {
      try {
        const contacts = await pgClient.select('sfid', 'name').from('salesforce.contact');
        // eslint-disable-next-line
        res.send(contacts);
      } catch (err) {
        // eslint-disable-next-line
        console.log('ERROR: contacts query failed');
        res.status(500).send();
      }
    });
    if (LOCALHOST) {
      https
        .createServer(
          {
            key: fs.readFileSync('server.key'),
            cert: fs.readFileSync('server.cert'),
          },
          app
        )
        // eslint-disable-next-line
        .listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
    } else {
      // eslint-disable-next-line
      app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
    }
  } catch (err) {
    // eslint-disable-next-line
    console.log(`ERROR: Start ${err}`);
    process.exit(1);
  }
};
start();
