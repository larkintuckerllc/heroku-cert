import jsforce from 'jsforce';
import { SFDC_ACCESS_TOKEN_KEY, SFDC_INSTANCE_URL_KEY, SFDC_REFERESH_TOKEN_KEY } from './constants';
import { SFDC_CALLBACK_URL, SFDC_CONSUMER_KEY, SFDC_CONSUMER_SECRET } from './env';
import { getValue, setValue } from './redis';

export default async (): Promise<void> => {
  const accessToken = await getValue(SFDC_ACCESS_TOKEN_KEY);
  const refreshToken = await getValue(SFDC_REFERESH_TOKEN_KEY);
  const instanceUrl = await getValue(SFDC_INSTANCE_URL_KEY);
  if (accessToken === null || instanceUrl === null || refreshToken === null) {
    // eslint-disable-next-line
    console.log('WARNING: SFDC not authorized');
    return;
  }
  const conn = new jsforce.Connection({
    oauth2: {
      clientId: SFDC_CONSUMER_KEY,
      clientSecret: SFDC_CONSUMER_SECRET,
      redirectUri: SFDC_CALLBACK_URL,
    },
    instanceUrl,
    accessToken,
    refreshToken,
  });
  const handleRefresh = async (freshAccessToken: string): Promise<void> => {
    try {
      await setValue(SFDC_ACCESS_TOKEN_KEY, freshAccessToken);
    } catch (err) {
      //
    }
    conn.off('refresh', handleRefresh);
  };
  conn.on('refresh', handleRefresh);
  const res = await conn.query('SELECT Id, Name FROM Contact');
  // eslint-disable-next-line
  console.log(res.records); // IN THEORY SYNCHONIZE TO POSTGRES
};
