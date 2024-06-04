const UserService = require('../services/userService');

class UsersController {
  static getById = async (req, res, next) => {
    const { id } = req.params;
    try {
      const user = await UserService.getById(id);
      return res.json(user);
    } catch (error) {
      next(error);
    }
  };

  static create = async (req, res, next) => {
    try {
      const newUser = await UserService.create(req.body);
      return res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  };

  static update = async (req, res, next) => {
    const { id } = req.params;
    const isPutMethod = req.method === 'PUT';

    try {
      const updatedUser = await UserService.update(id, req.body, isPutMethod);

      return res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  };

  static delete = async (req, res, next) => {
    const { id } = req.params;
    try {
      await UserService.delete(id);
      return res.json({ message: 'User deleted' });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = { UsersController };
