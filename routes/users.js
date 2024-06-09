const { Router } = require('express');
const { UsersController } = require('../controllers/users');
const db = require('../lib/db');

const createUserRouter = async () => {
  const usersRouter = Router();
  const dbClient = await db.getClient();
  const usersController = new UsersController(dbClient);

  usersRouter.get('/:id', usersController.getById);
  usersRouter.post('/', usersController.create);
  usersRouter.patch('/:id', usersController.update);
  usersRouter.put('/:id', usersController.update);
  usersRouter.delete('/:id', usersController.delete);

  return usersRouter;
};

module.exports = { createUserRouter };
