import mongoose from 'mongoose';
import config from '../config';

const initDatabase = (): void => {
  const { username, password, host, database, port } = config.database;

  console.log(`mongodb://${username}:${password}@${host}:${port}/${database}?authSource=admin&authMechanism=SCRAM-SHA-1`);

  mongoose.connect(
    `mongodb://${username}:${password}@${host}:${port}/${database}?authSource=admin&authMechanism=SCRAM-SHA-1`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  );
};

export default initDatabase;
