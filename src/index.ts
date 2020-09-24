import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import initDatabase from './database';
import Api from './apis';

// eslint-disable-next-line import/prefer-default-export
export const app = express();

initDatabase();

app.use(morgan('dev'));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/', Api);
