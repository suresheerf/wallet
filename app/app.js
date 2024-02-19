import express from 'express';
import morgan from 'morgan';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import m2s from 'mongoose-to-swagger';

import globalErrHandler from './utils/errorHandler.js';
import protect from './utils/protect.js';
import AppError from './utils/appError.js';

import userRouter from './user/routes.js';
import accountRouter from './account/routes.js';
import transactionRouter from './transaction/routes.js';

import User from './user/model.js';
import Account from './account/model.js';


const app = express();

const options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'api-test-easy API with Swagger',
      version: '0.1.0',
      description: 'This is a nodejs application made with Express and documented with Swagger',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
    },
    servers: [
      {
        url: 'http://localhost:3007',
      },
    ],
    components: {
      schemas: {
        User: m2s(User),
        Account: m2s(Account)
      },
    },
  },
  apis: ['./app/*/controller.js'],
};

const specs = swaggerJsdoc(options);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.status(200).json({ message: 'server running' });
});

// mounting routes

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));


app.use('/api', userRouter);
app.use('/api/accounts',protect, accountRouter);
app.use('/api/transactions',protect, transactionRouter);


app.all('*', (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrHandler);

export default app;
