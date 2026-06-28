import express from 'express';
import cors from 'cors';

import Routes from './server/route.js';
import Connection from './database/db.js';
import { config } from './config/index.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/', Routes);

app.use(errorHandler);

Connection(config.db.username, config.db.password);

app.listen(config.port, () =>
  console.log(`Server is running successfully on PORT ${config.port}`)
);
