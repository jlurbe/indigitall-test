const db = require('../lib/db');

const dbCLient = db.getClient();

class UserModel {
  static getById = async ({ id }) => {
    try {
      const user = await dbCLient.get('SELECT * FROM users WHERE id = $id', {
        id,
      });

      return user;
    } catch (error) {
      throw new Error(`Error getting user: ${error.message}`);
    }
  };

  static create = async ({ user }) => {
    const { username, email, password, longitude, latitude, browser_language } =
      user;
    dbCLient.run(
      `
      INSERT INTO users 
        (username, email, password, longitude, latitude, browser_language) 
      VALUES 
        ($username, $email, $password, longitude, latitude, browser_language) `,
      {
        username,
        email,
        password,
        longitude,
        latitude,
        browser_language,
      },
      function (error) {
        if (error) {
          throw new Error(`Error creating user: ${error.message}`);
        }

        return { id: this.lastID, ...user };
      }
    );
  };

  static put = async ({ id, user }) => {
    const { username, email, password, longitude, latitude, browser_language } =
      user;
    dbCLient.run(
      `
      UPDATE users 
        (username, email, password, longitude, latitude, browser_language) 
      SET 
        ($username, $email, $password, longitude, latitude, browser_language)
      WHERE
        id = $id`,
      {
        id,
        username,
        email,
        password,
        longitude,
        latitude,
        browser_language,
      },
      function (error) {
        if (error) {
          throw new Error(`Error with user put: ${error.message}`);
        }

        return user;
      }
    );
  };

  static delete = async ({ id }) => {
    try {
      await dbCLient.run('DELETE FROM users WHERE id = $id', { id });
    } catch (error) {
      throw new Error(`Error with user delete: ${error.message}`);
    }

    return true;
  };
}

module.exports = { UserModel };
