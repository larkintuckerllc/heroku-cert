const { DATABASE_URL, LOCALHOST } = process.env;
module.exports = {
  type: 'postgres',
  url: DATABASE_URL,
  synchronize: false,
  logging: false,
  entities: [
    'dist/entity/**/*.js',
  ],
  migrations: [
    'dist/migration/**/*.js',
  ],
  subscribers: [
    'dist/subscriber/**/*.js',
  ],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber',
  },
  extra: {
    ssl: LOCALHOST !== undefined,
  }
};
