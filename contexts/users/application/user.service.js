const { errorCodes } = require('../../../const/errorCodes');
const { codify_error } = require('../../../lib/error');
const { validateUser, validatePartialUser } = require('../../../schemas/user');
const {
  insertUser,
  getUser,
  updateUser,
  deleteUser,
} = require('../../../services/southernUsersApi');
const { isSouthOrNorth } = require('../../../utils/geoLocation');

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;

    // Bind methods to ensure 'this' context is correct
    this.getById = this.getById.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async getById(id) {
    let user = await this.userRepository.getById({ id });

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
        newUser = await this.userRepository.create({
          user: userValidation.data,
        });
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
        updatedUser = await this.userRepository.update({
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
    const result = await this.userRepository.delete({ id });

    if (!result) {
      // Not found. We try to remove from south hemisphere
      await deleteUser(id);
    }
  }
}

module.exports = { UserService };
