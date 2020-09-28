import mongoose from 'mongoose';
import config from '../config';

const initDatabase = (): void => {
  const { username, password, host, database, port } = config.database;

  mongoose.connect(
    `mongodb://${host}:${port}/${database}?authSource=admin&authMechanism=SCRAM-SHA-1`,
    {
      user: username,
      pass: password,
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  );
};

export default initDatabase;
