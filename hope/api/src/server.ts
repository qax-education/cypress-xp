import express from 'express';
import 'express-async-errors';
import 'dotenv/config'

import cors from 'cors';
import path from 'path';

import mongoose from 'mongoose'

import routes from './routes';
import errorHandler from './errors/handler';

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost')
    .then(() => console.log('Conectado no banco de dados'));

const app = express();

app.use(cors());
app.options('*', cors());

app.use(express.json());
app.use(routes);
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use(errorHandler);

app.listen(3333, () => {
    console.log('Hope API online na porta 3333 o/')
});
