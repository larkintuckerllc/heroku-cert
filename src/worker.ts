import { SimpleConsumer } from 'no-kafka';

// KAFKA SETUP
const KAFKA_TOPIC = 'test';
const KAFKA_PARTITION = 0;
const { KAFKA_URL } = process.env;
if (KAFKA_URL === undefined) {
  // eslint-disable-next-line
  console.log('ERROR: KAFKA_URL env variable missing');
  process.exit(1);
}
const consumer = new SimpleConsumer();

const start = async (): Promise<void> => {
  try {
    await consumer.init();
    consumer.subscribe(
      KAFKA_TOPIC,
      KAFKA_PARTITION,
      { offset: 0 },
      (messageSet, topic, partition) => {
        messageSet.forEach(m => {
          // eslint-disable-next-line
          console.log(topic, partition, m.offset, m.message.value.toString('utf8'));
        });
        return Promise.resolve(true);
      }
    );
  } catch (err) {
    // eslint-disable-next-line
    console.log(`ERROR: Start ${err}`);
    process.exit(1);
  }
};
start();
