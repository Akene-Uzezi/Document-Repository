const db = require("../database/documentRepository.db");
const bcrypt = require("bcrypt");
class User {
  constructor(name, email, password) {
    this.name = name;
    this.email = email;
    this.password = password;
  }

  async alreadyExists() {
    const user = await db
      .getDb()
      .collection("users")
      .findOne({ email: this.email });
    if (!user) {
      return false;
    } else {
      return true;
    }
  }

  async createUser() {
    try {
      const hashedPassword = await bcrypt.hash(this.password, 12);
      const userData = {
        name: this.name,
        email: this.email,
        password: hashedPassword,
      };
      await db.getDb().collection("users").insertOne(userData);
      return;
    } catch (error) {
      console.error("Error creating user:", error);
    }
  }

  static async findByEmail(email) {
    const user = await db.getDb().collection("users").findOne({ email: email });
    return user;
  }

  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;
