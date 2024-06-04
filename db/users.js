const getUserByIdQuery = `
  SELECT 
    id, username, email, longitude, latitude, ctime, mtime 
  FROM 
    users 
  WHERE 
    id = $id`;

const createUserQuery = `
  INSERT INTO users
    (username, email, password, longitude, latitude, browser_language)
  VALUES 
    ($username, $email, $password, $longitude, $latitude, $browser_language)`;

const updateUserQuery = `
  UPDATE users 
  SET
    username = $username, 
    email = $email, 
    password = $password, 
    longitude = $longitude, 
    latitude = $latitude, 
    browser_language = $browser_language
  WHERE
    id = $id`;

const deleteUserByIdQuery = `DELETE FROM users WHERE id = $id`;

module.exports = {
  getUserByIdQuery,
  createUserQuery,
  updateUserQuery,
  deleteUserByIdQuery,
};
