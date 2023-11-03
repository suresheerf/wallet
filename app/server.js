import mongoose from 'mongoose';

import { PORT, DBURI } from './config.js';
import app from './app.js';

mongoose
  .connect(DBURI)
  .then(() => {
    console.log('DB connection successful');
  })
  .catch((err) => {
    console.error('Error:', err);
  });

app
  .listen(PORT, () => {
    console.log(`App listening on ${PORT}`);
  })
  .on('error', (err) => {
    console.log('err: ', err);
  });
