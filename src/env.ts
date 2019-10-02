/* eslint-disable */
export const DATABASE_URL = process.env.DATABASE_URL;
export const DEVELOPMENT = process.env.DEVELOPMENT;
export const LOCALHOST = process.env.LOCALHOST;
export const REDIS_URL = process.env.REDIS_URL;
export const SFDC_CALLBACK_URL = process.env.SFDC_CALLBACK_URL;
export const SFDC_CONSUMER_KEY = process.env.SFDC_CONSUMER_KEY;
export const SFDC_CONSUMER_SECRET = process.env.SFDC_CONSUMER_SECRET;
/* eslint-enable */
if (
  REDIS_URL === undefined ||
  SFDC_CALLBACK_URL === undefined ||
  SFDC_CONSUMER_KEY === undefined ||
  SFDC_CONSUMER_SECRET === undefined
) {
  // eslint-disable-next-line
  console.log('ERROR: env variable missing');
  process.exit(1);
}
