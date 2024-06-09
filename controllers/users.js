const { UserModel } = require('../models/user');
const { UserService } = require('../services/userService');

class UsersController {
  constructor(dbClient) {
    const userModel = new UserModel(dbClient);
    this.userService = new UserService(userModel);

    // Bind methods to ensure 'this' context is correct
    this.getById = this.getById.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async getById(req, res, next) {
    const { id } = req.params;
    try {
      const user = await this.userService.getById(id);
      return res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const newUser = await this.userService.create(req.body);
      return res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    const { id } = req.params;

    try {
      const updatedUser = await this.userService.update(
        id,
        req.body,
        req.method
      );

      return res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    const { id } = req.params;
    try {
      await this.userService.delete(id);
      return res.json({ message: 'User deleted' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = { UsersController };
