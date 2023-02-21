import express from 'express';
import MemoryService from './service.js';
import service from "./service.js";

const router = express.Router();

const routes = (service) => {
  router.post('/', async (req, res, next) => {
    try {
      const { memoryData, categoryIds, userId } = req.body;
      const memory = await service.createMemory(memoryData, categoryIds, userId);
      res.json(memory);
    } catch (err) {
      next(err);
    }
  });

  router.put('/:id', async (req, res, next) => {
    try {
      const { memoryData, categoryIds, userId } = req.body;
      const memory = await service.updateMemory(memoryData, categoryIds, userId);
      res.json(memory);
    } catch (err) {
      next(err);
    }
  });

  router.get('/:id', async (req, res, next) => {
    try {
      const id = req.params.id;
      const memory = await service.getMemory(id);
      res.json(memory);
    } catch (err) {
      next(err);
    }
  });

  return router;
}

export default routes;
