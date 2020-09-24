import mongoose from 'mongoose';
import config from '../config';

const initDatabase = () => {
  const { username, password, host, database, port } = config.database;

  mongoose.connect(
    `mongodb://${username}:${password}@${host}:${port}/${database}`
  );

  const db = mongoose.connection;

  const handleError = (err: Error) => console.error(`error on mongodb connection \n${err}`);

  db.on('error', handleError);
};

export default initDatabase;
