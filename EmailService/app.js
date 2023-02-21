import dotenv from 'dotenv';
import express from 'express';
import service from './service.js';
import { Saga } from 'rabbitbox/dist/index.js';
import sagaConfig from "./config/saga.js";
import subscribers from './subscribers.js';

dotenv.config();

const app = express();

app.use(express.json());

const init = async () => {
  const saga = await Saga.build(...sagaConfig);

  const emailService = await service(saga);

  subscribers(saga, emailService);

  app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
  })
}

init();
