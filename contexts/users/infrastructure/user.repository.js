const { errorCodes } = require('../../../const/errorCodes');
const {
  createUserQuery,
  deleteUserByIdQuery,
  getUserByIdQuery,
  updateUserQuery,
} = require('../../../db/users');
const { codify_error } = require('../../../lib/error');
const { hashPassword } = require('../../../lib/hashUtils');
const { User } = require('../domain/entities/user');

class UserRepository {
  constructor(dbCLient) {
    this.dbCLient = dbCLient;

    // Bind methods to ensure 'this' context is correct
    this.getById = this.getById.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async getById({ id }) {
    try {
      const user = await this.dbCLient.get(getUserByIdQuery, {
        $id: id,
      });

      return user ? new User(user) : null;
    } catch (error) {
      throw codify_error(
        new Error(`Error getting user: ${error.message}`),
        errorCodes.USER_NOT_RETRIEVED
      );
    }
  }

  async create({ user }) {
    let { username, email, password, longitude, latitude, browser_language } =
      user;
    const hashedPassword = await hashPassword(password);

    try {
      const result = await this.dbCLient.run(createUserQuery, {
        $username: username,
        $email: email,
        $password: hashedPassword,
        $longitude: longitude,
        $latitude: latitude,
        $browser_language: browser_language,
      });

      if (result.changes === 0) {
        throw codify_error(
          new Error('User cannot be created'),
          errorCodes.NOT_CREATED_USER
        );
      }

      return { id: result?.lastID, ...user, password: undefined };
    } catch (error) {
      throw codify_error(
        new Error(`Error creating user: ${error.message}`),
        errorCodes.NOT_CREATED_USER
      );
    }
  }

  async update({ id, user }) {
    if (user.password) {
      user.password = await hashPassword(user.password);
    }

    const { updateFields, updateValues } = this.#buildUpdate({ user });

    try {
      var result = await this.dbCLient.run(
        updateUserQuery.replace('_UPDATE_FIELDS_', updateFields),
        {
          $id: id,
          ...updateValues,
        }
      );

      if (result.changes === 0) {
        throw codify_error(
          new Error('User cannot be updated'),
          errorCodes.USER_ID_NOT_FOUND
        );
      }

      return { id, ...user, password: undefined };
    } catch (error) {
      if (error.code === errorCodes.USER_ID_NOT_FOUND) {
        throw error;
      }

      throw codify_error(
        new Error(`Error with user update: ${error.message}`),
        errorCodes.NOT_UPDATED_USER
      );
    }
  }

  async delete({ id }) {
    try {
      const result = await this.dbCLient.run(deleteUserByIdQuery, {
        $id: id,
      });

      if (result.changes === 0) {
        return false;
      }

      return true;
    } catch (error) {
      throw codify_error(
        new Error(`Error with user delete: ${error.message}`),
        errorCodes.NOT_DELETED_USER
      );
    }
  }

  #buildUpdate({ user }) {
    const userKeys = Object.keys(user);
    const userValues = Object.values(user);

    let updateFields = [];
    let updateValues = {};

    userKeys.forEach((userKey, index) => {
      updateFields.push(`${userKey} = $${userKey}`);
      updateValues[`$${userKey}`] = userValues[index];
    });

    return { updateFields: updateFields.join(', '), updateValues };
  }
}

module.exports = { UserRepository };
