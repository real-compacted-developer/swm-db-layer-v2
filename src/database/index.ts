import mongoose from 'mongoose';
import fs from 'fs';
import config from '../config';

const initDatabase = (): void => {
  const { username, password, host, database, port } = config.database;

  const ca = [fs.readFileSync('ca/rds-combined-ca-bundle.pem')];

  mongoose.connect(
    `mongodb://${username}:${password}@${host}:${port}/${database}?authSource=admin&authMechanism=SCRAM-SHA-1&ssl=true&replicaSet=rs0&readPreference=secondaryPreferred`,
    {
      sslValidate: true,
      sslCA: ca,
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  );
};

export default initDatabase;
