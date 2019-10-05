import knex from 'knex';
import pg from 'pg';
import { DATABASE_URL, LOCALHOST } from './env';

if (LOCALHOST !== undefined) {
  pg.defaults.ssl = true;
}
export default knex({
  client: 'pg',
  connection: DATABASE_URL,
});
