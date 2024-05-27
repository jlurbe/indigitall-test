const { UserModel } = require('../models/user');
const { validateUser } = require('../schemas/user');

class UsersController {
  static getById = async (req, res) => {
    const { id } = req.query;
    const user = await UserModel.getById({ id });

    if (user) {
      return res.json(user);
    }

    return res.status(404).json({ message: 'User not found' });
  };

  static create = async (req, res) => {
    const userValidation = validateUser(req.body);

    if (userValidation.error) {
      return res
        .status(400)
        .json({ error: JSON.parse(userValidation.error.message) });
    }

    const newUser = await UserModel.create({ user: userValidation.data });

    return res.status(201).json(newUser);
  };

  static put = async (req, res) => {
    const userValidation = validateUser(req.body);

    if (userValidation.error) {
      return res
        .status(400)
        .json({ error: JSON.parse(userValidation.error.message) });
    }

    const { id } = req.params;

    const updatedUser = await UserModel.put({ id, user: userValidation.data });

    if (updatedUser === false) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(updatedUser);
  };

  static delete = async (req, res) => {
    const { id } = req.params;

    const result = await UserModel.delete({ id });

    if (result === false) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ message: 'User deleted' });
  };
}

module.exports = { UsersController };
