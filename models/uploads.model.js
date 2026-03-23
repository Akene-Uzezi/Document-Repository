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

  static async findFileById(id) {
    return await db
      .getDb()
      .collection("uploads")
      .findOne({ _id: new ObjectId(id) });
  }
}

module.exports = Uploads;
