import express, { query } from 'express';
import { config } from './config';
import { connectToDatabase } from './db/models/db';
import { exit } from 'process';
import { DatabaseService } from './services/database.service';
import { body, param } from 'express-validator';
import { SubscriptionsService } from './services/subscription.service';
import { ExchangerService } from './services/exhanger.service';
import { SchedulerService } from './services/scheduler.service';
import * as bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || 3000;
const successStatusCode = 200;
const invalidStatusCode = 400;
const existingValueStatusCode = 409;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/rate', async (request, response) => {
  const currentRate = await ExchangerService.getCurrentRate();
  if (!currentRate) {
    response.status(invalidStatusCode).json('Invalid status value');
  }
  response.status(successStatusCode).json(currentRate);
});

app.post('/subscribe', body('email').trim().isEmail().withMessage('Specify valid email'), async (request, response) => {
  const email = request.body.email as string;
  const subscriptionService = new SubscriptionsService();
  const subscribed = await subscriptionService.findByEmail(email);
  if (subscribed) {
    return response.status(existingValueStatusCode).json('Email is already subscribed');
  }
  await subscriptionService.create(email);
  return response.status(successStatusCode).json(`Email ${email} added to subscription`);
});

app.listen(port, async () => {
  const databaseService = new DatabaseService();
  try {
    connectToDatabase(config.db);
    databaseService.authenticate();
    SchedulerService.init();
  } catch (error) {
    console.log('Error received while connecting to DB: ', error);
    await SchedulerService.shutdown();
    exit(1);
  }

  console.log(`Running on port ${port}`);
});
