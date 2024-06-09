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
  constructor(userModel) {
    this.userModel = userModel;
  }

  async getById(id) {
    let user = await this.userModel.getById({ id });

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

  async create(data) {
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
        newUser = await this.userModel.create({ user: userValidation.data });
        break;
      case 'S':
        newUser = await insertUser(userValidation.data);
        break;
    }

    return newUser;
  }

  async update(id, data, method) {
    const isPutMethod = method === 'PUT';

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
        updatedUser = await this.userModel.update({
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

  async delete(id) {
    // First we try to delete from north hemisphere
    const result = await this.userModel.delete({ id });

    if (!result) {
      // Not found. We try to remove from south hemisphere
      await deleteUser(id);
    }
  }
}

module.exports = { UserService };
