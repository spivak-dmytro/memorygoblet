import dotenv from 'dotenv';
import express from 'express';
import { Saga } from 'rabbitbox/dist/index.js';
import service from './service.js';
import PrismaClient from "./config/prismaClient";
import sagaConfig from "./config/saga";
import routes from './routes.js';

dotenv.config();

const app = express();

app.use(express.json());

const init = async () => {
  const saga = await Saga.build(...sagaConfig);
  const prismaClient = PrismaClient.getPrismaClient();

  const userService = await service(saga, prismaClient);

  app.use('/', routes(userService));

  app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
  })
}

init();
