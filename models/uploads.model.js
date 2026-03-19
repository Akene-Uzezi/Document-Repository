const db = require("../database/documentRepository.db");
const ObjectId = require("mongodb").ObjectId;
class Uploads {
  static async getUserfiles(userId) {
    return await db
      .getDb()
      .collection("uploads")
      .findMany({ user: new ObjectId(userId) });
  }
}

module.exports = Uploads;
