const errorCodes = require('../const/errorCodes');
const { codify_error } = require('./error');

const insertUser = (data) => {
  return new Promise((resolve, reject) => {
    const rand = Math.random() * 10;
    if (rand > 4) {
      reject(
        codify_error(
          new Error(`User cannot be created`),
          errorCodes.NOT_CREATED_USER
        )
      );
    }
    setTimeout(() => {
      resolve({ id: Math.floor(Math.random() * 1000 + 1), ...data });
    }, 1000);
  });
};

const getUser = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const rand = Math.random() * 10;
      if (rand > 4) {
        reject(
          codify_error(
            new Error('User not found'),
            errorCodes.USER_ID_NOT_FOUND
          )
        );
      }
      resolve({
        id,
        username: 'jlurbe',
        email: 'jlurbe@gmail.com',
        longitude: 120.12234,
        latitude: -20.34789,
        browser_language: 'es',
        ctime: '2024-05-27 13:15:19',
        mtime: '2024-05-27 13:15:19',
      });
    }, 1000);
  });
};

const updateUser = (id, data) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const rand = Math.random() * 10;
      if (rand > 4) {
        reject(
          codify_error(
            new Error(`User cannot be updated`),
            errorCodes.USER_ID_NOT_FOUND
          )
        );
      }
      resolve({ id, ...data });
    }, 1000);
  });
};

const deleteUser = (data) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const rand = Math.random() * 10;
      if (rand > 4) {
        reject(
          codify_error(
            new Error(`User cannot be deleted`),
            errorCodes.USER_ID_NOT_FOUND
          )
        );
      }
      resolve();
    }, 1000);
  });
};

module.exports = {
  getUser,
  insertUser,
  updateUser,
  deleteUser,
};
