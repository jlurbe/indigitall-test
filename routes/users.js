const { Router } = require('express');
const { UsersController } = require('../controllers/users');

const usersRouter = Router();

//usersRouter.get('/', UsersController.getAll);
usersRouter.get('/:id', UsersController.getById);
usersRouter.post('/', UsersController.create);
usersRouter.put('/:id', UsersController.put);
usersRouter.delete('/:id', UsersController.delete);
// usersRouter.patch('/:id', UsersController.patch);

module.exports = { usersRouter };
