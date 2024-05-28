const { Router } = require('express');
const { UsersController } = require('../controllers/users');

const usersRouter = Router();

usersRouter.get('/:id', UsersController.getById);
usersRouter.post('/', UsersController.create);
usersRouter.put('/:id', UsersController.put);
usersRouter.delete('/:id', UsersController.delete);

module.exports = { usersRouter };
