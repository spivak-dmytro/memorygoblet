import { Router } from 'express';

const router = new Router();

const routes = (service) => {
  router.get('/users', async (req, res) => {
    const users = await service.getUsers();
    res.json(users);
  });

  router.post('/users', async (req, res) => {
    const user = await service.createUser(req.body);
    res.json(user);
  })

  return router;
}

export default routes;
