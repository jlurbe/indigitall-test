const db = require('../lib/db');

class UserModel {
  static getById = async ({ id }) => {
    const dbCLient = await db.getClient();

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
    const dbCLient = await db.getClient();
    const { username, email, password, longitude, latitude, browser_language } =
      user;

    dbCLient.run(
      `
      INSERT INTO users
        (username, email, password, longitude, latitude, browser_language)
      VALUES 
        ($username, $email, $password, $longitude, $latitude, $browser_language)`,
      {
        $username: username,
        $email: email,
        $password: password,
        $longitude: longitude,
        $latitude: latitude,
        $browser_language: browser_language,
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
    const dbCLient = await db.getClient();

    const { username, email, password, longitude, latitude, browser_language } =
      user;
    dbCLient.run(
      `
      UPDATE users 
      SET
        username = $username, 
        email = $email, 
        password = $password, 
        longitude = $longitude, 
        latitude = $latitude, 
        browser_language = $browser_language
      WHERE
        id = $id`,
      {
        $id: id,
        $username: username,
        $email: email,
        $password: password,
        $longitude: longitude,
        $latitude: latitude,
        $browser_language: browser_language,
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
    const dbCLient = await db.getClient();

    try {
      await dbCLient.run('DELETE FROM users WHERE id = $id', { $id: id });
    } catch (error) {
      throw new Error(`Error with user delete: ${error.message}`);
    }

    return true;
  };
}

module.exports = { UserModel };
