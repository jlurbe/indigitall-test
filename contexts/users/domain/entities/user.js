class User {
  constructor({
    id,
    username,
    email,
    password,
    longitude,
    latitude,
    browser_language,
    ctime,
    mtime,
  }) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.longitude = longitude;
    this.latitude = latitude;
    this.browserLanguage = browser_language;
    this.ctime = ctime;
    this.mtime = mtime;
  }
}

module.exports = { User };
