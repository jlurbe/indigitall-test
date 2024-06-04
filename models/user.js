const errorCodes = require('../const/errorCodes');
const db = require('../lib/db');
const { hashPassword } = require('../lib/hashUtils');
const { codify_error } = require('../lib/error');
const {
  getUserByIdQuery,
  createUserQuery,
  updateUserQuery,
  deleteUserByIdQuery,
} = require('../db/users');

class UserModel {
  static getById = async ({ id }) => {
    const dbCLient = await db.getClient();

    try {
      const user = await dbCLient.get(getUserByIdQuery, {
        $id: id,
      });

      return user;
    } catch (error) {
      throw codify_error(
        new Error(
          `Error getting user: ${error.message}`,
          errorCodes.USER_NOT_RETRIEVED
        )
      );
    }
  };

  static create = async ({ user }) => {
    const dbCLient = await db.getClient();
    let { username, email, password, longitude, latitude, browser_language } =
      user;
    const hashedPassword = await hashPassword(password);

    try {
      const result = await dbCLient.run(createUserQuery, {
        $username: username,
        $email: email,
        $password: hashedPassword,
        $longitude: longitude,
        $latitude: latitude,
        $browser_language: browser_language,
      });

      if (result.changes === 0) {
        throw codify_error(
          new Error(`User cannot be created`),
          errorCodes.NOT_CREATED_USER
        );
      }

      return { id: result?.lastID, ...user, password: hashedPassword };
    } catch (error) {
      if (error) {
        if (error.code === errorCodes.NOT_CREATED_USER) {
          throw error;
        }

        throw codify_error(
          new Error(
            `Error creating user: ${error.message}`,
            errorCodes.NOT_CREATED_USER
          )
        );
      }
    }
  };

  static put = async ({ id, user }) => {
    const dbCLient = await db.getClient();
    const { username, email, password, longitude, latitude, browser_language } =
      user;
    const hashedPassword = await hashPassword(password);

    try {
      var result = await dbCLient.run(updateUserQuery, {
        $id: id,
        $username: username,
        $email: email,
        $password: hashedPassword,
        $longitude: longitude,
        $latitude: latitude,
        $browser_language: browser_language,
      });

      if (result.changes === 0) {
        throw codify_error(
          new Error(`User cannot be updated`),
          errorCodes.USER_ID_NOT_FOUND
        );
      }

      return { id, ...user, password: hashedPassword };
    } catch (error) {
      if (error.code === errorCodes.USER_ID_NOT_FOUND) {
        throw error;
      }

      throw codify_error(
        new Error(
          `Error with user put: ${error.message}`,
          errorCodes.NOT_UPDATED_USER
        )
      );
    }
  };

  static delete = async ({ id }) => {
    const dbCLient = await db.getClient();

    try {
      const result = await dbCLient.run(deleteUserByIdQuery, {
        $id: id,
      });

      if (result.changes === 0) {
        return false;
      }
    } catch (error) {
      throw codify_error(
        new Error(
          `Error with user delete: ${error.message}`,
          errorCodes.NOT_DELETED_USER
        )
      );
    }

    return true;
  };
}

module.exports = { UserModel };
