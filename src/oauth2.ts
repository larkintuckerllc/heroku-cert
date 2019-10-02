import { Router } from 'express';
import jsforce from 'jsforce';
import { SFDC_ACCESS_TOKEN_KEY, SFDC_REFERESH_TOKEN_KEY, SFDC_INSTANCE_URL_KEY } from './constants';
import { SFDC_CALLBACK_URL, SFDC_CONSUMER_KEY, SFDC_CONSUMER_SECRET } from './env';
import { setValue } from './redis';
import synchronize from './synchronize';

const oauth2 = new jsforce.OAuth2({
  clientId: SFDC_CONSUMER_KEY,
  clientSecret: SFDC_CONSUMER_SECRET,
  redirectUri: SFDC_CALLBACK_URL,
});
const router = Router();
router.get('/auth', (req, res) => {
  res.redirect(oauth2.getAuthorizationUrl({ scope: 'api id web refresh_token offline_access' }));
});
router.get('/callback', (req, res) => {
  const { code } = req.query;
  /* eslint-disable-next-line */
  const conn: any = new jsforce.Connection({ oauth2 }); // WORK-AROUND FOR REFRESH TOKEN
  /* eslint-disable-next-line */
  conn.authorize(code, async (errAuthorize: any) => {
    if (errAuthorize) {
      res.status(500).send();
      return;
    }
    const { accessToken, instanceUrl, refreshToken } = conn;
    try {
      await setValue(SFDC_ACCESS_TOKEN_KEY, accessToken);
      await setValue(SFDC_INSTANCE_URL_KEY, instanceUrl);
      await setValue(SFDC_REFERESH_TOKEN_KEY, refreshToken);
      await synchronize(); // SYNCHRONIZE DATA FIRST TIME
      res.send({ authorized: true });
    } catch (errFinish) {
      res.status(500).send();
    }
  });
});
export default router;
