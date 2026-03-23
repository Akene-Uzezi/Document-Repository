const db = require("../database/documentRepository.db");
const ObjectId = require("mongodb").ObjectId;
class Uploads {
  static async getUserfiles(userId) {
    return await db
      .getDb()
      .collection("uploads")
      .find({ user: userId })
      .toArray();
  }

  static async upload(fileData) {
    await db.getDb().collection("uploads").insertOne(fileData);
  }
}

module.exports = Uploads;
