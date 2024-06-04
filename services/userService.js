const { UserModel } = require('../models/user');
const {
  getUser,
  insertUser,
  updateUser,
  deleteUser,
} = require('./southernUsersApi');
const { isSouthOrNorth } = require('../utils/geoLocation');
const { validateUser, validatePartialUser } = require('../schemas/user');
const { codify_error } = require('../lib/error');
const errorCodes = require('../const/errorCodes');

class UserService {
  static async getById(id) {
    let user = await UserModel.getById({ id });
    if (!user) {
      user = await getUser(id);
    }
    if (!user) {
      throw codify_error(
        new Error('User not found'),
        errorCodes.USER_ID_NOT_FOUND
      );
    }
    return user;
  }

  static async create(data) {
    //Zod validation
    const userValidation = validateUser(data);

    if (!userValidation.success) {
      throw codify_error(
        new Error('The validation could not be completed'),
        errorCodes.NOT_VALIDATED_INFO,
        userValidation.error.message
      );
    }

    const hemisphere = await isSouthOrNorth(
      userValidation.data.latitude,
      userValidation.data.longitude
    );

    let newUser;

    switch (hemisphere) {
      case 'N':
        newUser = await UserModel.create({ user: userValidation.data });
        break;
      case 'S':
        newUser = await insertUser(userValidation.data);
        break;
    }

    return newUser;
  }

  static async update(id, data, isPutMethod) {
    //Zod validation
    const userValidation = isPutMethod
      ? validateUser(data)
      : validatePartialUser(data);

    if (userValidation.error) {
      throw codify_error(
        new Error('The validation could not be completed'),
        errorCodes.NOT_VALIDATED_INFO,
        userValidation.error.message
      );
    }

    const hemisphere = await isSouthOrNorth(
      userValidation.data.latitude,
      userValidation.data.longitude
    );

    let updatedUser;

    switch (hemisphere) {
      case 'N':
        updatedUser = await UserModel.update({
          id,
          user: userValidation.data,
        });
        break;
      case 'S':
        updatedUser = await updateUser(id, userValidation.data);
        break;
    }

    return updatedUser;
  }

  static async delete(id) {
    // First we try to delete from north hemisphere
    const result = await UserModel.delete({ id });

    if (!result) {
      // Not found. We try to remove from south hemisphere
      await deleteUser(id);
    }
  }
}

module.exports = UserService;
