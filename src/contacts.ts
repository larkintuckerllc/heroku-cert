import { Router } from 'express';
import uuidv4 from 'uuid/v4';
import pg from './pg';

const router = Router();
router.get('/', async (req, res) => {
  try {
    const contacts = await pg
      .select('sfid', 'external_id__c', 'name', 'firstname', 'lastname')
      .from('salesforce.contact');
    // eslint-disable-next-line
    res.send(contacts);
  } catch (err) {
    // eslint-disable-next-line
    console.log('ERROR: contacts query failed');
    res.status(500).send();
  }
});
router.post('/', async (req, res) => {
  const { firstName, lastName } = req.body;
  if (typeof firstName !== 'string' || typeof lastName !== 'string') {
    res.status(400).send();
    return;
  }
  const externalId = uuidv4();
  const sfid: string = null;
  const contact = {
    // eslint-disable-next-line
    external_id__c: externalId,
    firstname: firstName,
    lastname: lastName,
    name: `${firstName} ${lastName}`,
    sfid,
  };
  try {
    await pg('salesforce.contact').insert(contact);
    res.send(contact);
  } catch (err) {
    res.status(500).send();
  }
});
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const { type } = req.query;
  if (typeof id !== 'string' || (type !== 'sfid' && type !== 'external_id')) {
    res.status(400).send();
  }
  const key = type === 'sfid' ? 'sfid' : 'external_id__c';
  try {
    const count = await pg('salesforce.contact')
      .where(key, id)
      .del();
    if (count === 0) {
      res.status(404).send();
      return;
    }
    res.send({
      id,
      type,
    });
  } catch (err) {
    res.status(500).send();
  }
});

export default router;
