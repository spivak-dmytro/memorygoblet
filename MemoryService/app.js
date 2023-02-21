import dotenv from 'dotenv';
import express from 'express';
import { Saga } from 'rabbitbox/dist/index.js';
import winston from "winston";
import "winston-daily-rotate-file";
import routes from './routes.js';
import service from './service.js';
import PrismaClient from "./config/prismaClient.js";
import sagaConfig from "./config/saga.js";

dotenv.config();

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(), // Log to the console
    new winston.transports.DailyRotateFile({
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d'
    })
  ],
  exceptionHandlers: [
    new winston.transports.Console(),
    new winston.transports.DailyRotateFile({
      filename: 'logs/exceptions-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d'
    })
  ]
});

const app = express();

app.use(express.json());

app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send('Houston, we have a problem!');
});


const init = async () => {
  const saga = await Saga.build(...sagaConfig);
  const prismaClient = PrismaClient.getPrismaClient();

  const memoryService = await service(saga, prismaClient);

  app.use('/', routes(memoryService));

  app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
  })
}

init();
