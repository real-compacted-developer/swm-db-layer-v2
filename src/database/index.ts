import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import config from '../config';

const initDatabase = (): void => {
  const { username, password, host, database, port } = config.database;

  mongoose.connect(
    `mongodb://${username}:${password}@${host}:${port}/${database}`
  );

  const db = mongoose.connection;

  autoIncrement.initialize(db);

  const handleError = (err: Error) => console.error(`error on mongodb connection \n${err}`);

  db.on('error', handleError);
};

export default initDatabase;
