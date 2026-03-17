const db = require("../database/documentRepository.db");
const bcrypt = require("bcrypt");
class User {
  constructor(username, email, password) {
    this.username = username;
    this.email = email;
    this.password = password;
  }

  async createUser() {}
}
