import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import config from '../config';

const initDatabase = (): void => {
  const { username, password, host, database, port } = config.database;

  mongoose.connect(
    `mongodb://${username}:${password}@${host}:${port}/${database}?authSource=admin&authMechanism=SCRAM-SHA-1`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  ).then((db) => {
    autoIncrement.initialize(db.connection);
  });
};

export default initDatabase;
