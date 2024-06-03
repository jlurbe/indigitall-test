const errorCodes = require('../const/errorCodes');
const { UserModel } = require('../models/user');
const { validateUser } = require('../schemas/user');
const { error_message, codify_error } = require('../services/error');
const {
  getUser,
  insertUser,
  updateUser,
  deleteUser,
} = require('../services/southernUsersApi');
const { isSouthOrNorth } = require('../utils/geoLocation');

class UsersController {
  static getById = async (req, res, next) => {
    const { id } = req.params;

    try {
      // First we try to obtain the user from north hemisphere
      var user = await UserModel.getById({ id });

      // The user could be on the south hemisphere
      if (!user) {
        user = await getUser(id);
      }

      if (!user) {
        return next(
          codify_error(
            new Error('User not found'),
            errorCodes.USER_ID_NOT_FOUND
          )
        );
      }

      return res.json(user);
    } catch (error) {
      next(error);
    }
  };

  static create = async (req, res, next) => {
    //Zod validation
    const userValidation = validateUser(req.body);

    if (!userValidation.success) {
      return next(
        codify_error(
          new Error('The validation could not be completed'),
          errorCodes.NOT_VALIDATED_INFO,
          userValidation.error.message
        )
      );
    }

    try {
      const hemisphere = await isSouthOrNorth(
        userValidation.data.latitude,
        userValidation.data.longitude
      );

      switch (hemisphere) {
        case 'N':
          var newUser = await UserModel.create({ user: userValidation.data });
          break;
        case 'S':
          var newUser = await insertUser(userValidation.data);
          break;
      }

      return res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  };

  static put = async (req, res, next) => {
    const userValidation = validateUser(req.body);

    if (userValidation.error) {
      return next(
        codify_error(
          new Error('The validation could not be completed'),
          errorCodes.NOT_VALIDATED_INFO,
          userValidation.error.message
        )
      );
    }

    const { id } = req.params;

    try {
      const hemisphere = await isSouthOrNorth(
        userValidation.data.latitude,
        userValidation.data.longitude
      );

      switch (hemisphere) {
        case 'N':
          var updatedUser = await UserModel.put({
            id,
            user: userValidation.data,
          });
          break;
        case 'S':
          var updatedUser = await updateUser(id, userValidation.data);
          break;
      }

      return res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  };

  static delete = async (req, res, next) => {
    const { id } = req.params;
    try {
      // First we try to delete from north hemisphere
      const result = await UserModel.delete({ id });

      if (!result) {
        // Not found. We try to remove from south hemisphere
        await deleteUser(id);
      }

      return res.json({ message: 'User deleted' });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = { UsersController };
