import synchronize from '../synchronize';

const start = async (): Promise<void> => {
  try {
    await synchronize();
    setTimeout(() => {
      process.exit(0);
    }, 3000);
  } catch (err) {
    /* eslint-disable-next-line */
    console.log('ERROR: FAILED TO SYNCHRONIZE');
    process.exit(1);
  }
};
start();
