const { Router } = require('express');
const { UsersController } = require('../controllers/users');

const usersRouter = Router();

usersRouter.get('/:id', UsersController.getById);
usersRouter.post('/', UsersController.create);
usersRouter.patch('/:id', UsersController.update);
usersRouter.put('/:id', UsersController.update);
usersRouter.delete('/:id', UsersController.delete);

module.exports = { usersRouter };
