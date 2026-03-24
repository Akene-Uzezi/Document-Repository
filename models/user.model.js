const db = require("../database/documentRepository.db");
const nodemailer = require("nodemailer");
require("dotenv").config();
const bcrypt = require("bcrypt");
const ObjectId = require("mongodb").ObjectId;
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
      await this.sendEmail(this.email, this.name, this.password);
      return;
    } catch (error) {
      console.error("Error creating user:", error);
    }
  }

  async sendEmail(userEmail, userName, userPassword) {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.AdminEmail,
        pass: process.env.AppPassword,
      },
    });

    let mailOptions = {
      from: `"Filehub Admin" ${process.env.AdminEmail}`,
      to: userEmail,
      subject: "Welcome to Filehub",
      text: `Hi ${userName}, your account has been created successfully.
        These are your Login Details: 
        Email: ${userEmail},
        Password: ${userPassword}
      `,
    };
    try {
      let info = await transporter.sendMail(mailOptions);
      console.log("Email sent: " + info.response);
    } catch (err) {
      console.error("Error sending email", err);
    }
  }

  static async findByEmail(email) {
    const user = await db.getDb().collection("users").findOne({ email: email });
    return user;
  }

  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async findById(id) {
    return await db
      .getDb()
      .collection("users")
      .findOne({ _id: new ObjectId(id) });
  }

  static async deleteUser(id) {
    return await db
      .getDb()
      .collection("users")
      .deleteOne({ _id: new ObjectId(id) });
  }

  static async updateUser(id, name, email) {
    return await db
      .getDb()
      .collection("users")
      .updateOne({ _id: new ObjectId(id) }, { $set: { name, email } });
  }

  static async updatePassword(id, password) {
    const hashedPassword = await bcrypt.hash(password, 12);
    await db
      .getDb()
      .collection("users")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { password: hashedPassword } },
      );
  }
}

module.exports = User;
