const errorCodes = require('../const/errorCodes');
const { UserModel } = require('../models/user');
const { validateUser } = require('../schemas/user');
const { error_message } = require('../services/error');

class UsersController {
  static getById = async (req, res) => {
    const { id } = req.params;

    try {
      const user = await UserModel.getById({ id });

      return res.json(user);
    } catch (error) {
      if (error.code === errorCodes.USER_ID_NOT_FOUND) {
        return res.status(404).json(error_message(error));
      }

      if (error.code === errorCodes.USER_NOT_RETRIEVED) {
        return res.status(500).json(error_message(error));
      }

      return res.status(500).json({
        error_code: errorCodes.INTERNAL_SERVER_ERROR,
        error_message: error.message,
      });
    }
  };

  static create = async (req, res) => {
    const userValidation = validateUser(req.body);

    if (userValidation.error) {
      return res
        .status(400)
        .json({ error: JSON.parse(userValidation.error.message) });
    }

    try {
      const newUser = await UserModel.create({ user: userValidation.data });

      return res.status(201).json(newUser);
    } catch (error) {
      if (error.code === errorCodes.NOT_CREATED_USER) {
        return res.status(500).json(error_message(error));
      }

      return res.status(500).json({
        error_code: errorCodes.INTERNAL_SERVER_ERROR,
        error_message: error.message,
      });
    }
  };

  static put = async (req, res) => {
    const userValidation = validateUser(req.body);

    if (userValidation.error) {
      return res
        .status(400)
        .json({ error: JSON.parse(userValidation.error.message) });
    }

    const { id } = req.params;

    try {
      const updatedUser = await UserModel.put({
        id,
        user: userValidation.data,
      });

      return res.json(updatedUser);
    } catch (error) {
      if (error.code === errorCodes.USER_ID_NOT_FOUND) {
        return res.status(404).json(error_message(error));
      }

      if (error.code === errorCodes.NOT_UPDATED_USER) {
        return res.status(500).json(error_message(error));
      }

      return res.status(500).json({
        error_code: errorCodes.INTERNAL_SERVER_ERROR,
        error_message: error.message,
      });
    }
  };

  static delete = async (req, res) => {
    const { id } = req.params;
    try {
      await UserModel.delete({ id });

      return res.json({ message: 'User deleted' });
    } catch (error) {
      if (error.code === errorCodes.USER_ID_NOT_FOUND) {
        return res.status(404).json(error_message(error));
      }

      if (error.code === errorCodes.NOT_DELETED_USER) {
        return res.status(500).json(error_message(error));
      }

      return res.status(500).json({
        error_code: errorCodes.INTERNAL_SERVER_ERROR,
        error_message: error.message,
      });
    }
  };
}

module.exports = { UsersController };
