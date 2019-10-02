import { createClient } from 'redis';
import { REDIS_URL } from './env';

const redis = createClient({
  url: REDIS_URL,
});
redis.on('error', err => {
  // eslint-disable-next-line
  console.log(`ERROR: Redis error ${err}`);
  process.exit(1);
});
export const setValue = (key: string, value: string, expire?: number): Promise<true> =>
  new Promise<true>((resolve, reject): void => {
    const callback = (err: Error): void => {
      if (err !== null) {
        reject(err);
        return;
      }
      resolve(true);
    };
    if (expire !== undefined) {
      redis.set(key, value, 'EX', expire, callback);
    } else {
      redis.set(key, value, callback);
    }
  });
export const getValue = (key: string): Promise<string> =>
  new Promise<string>((resolve, reject): void => {
    redis.get(key, (err, value) => {
      if (err !== null) {
        reject(err);
        return;
      }
      resolve(value);
    });
  });
