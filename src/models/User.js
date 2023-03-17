const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const User = new Schema(
  {
    username: String,
    password: String,
    fullname: String,
    email: String,
    role: String,
    phone: String,
    file: String,
    isVerified: { type: Boolean, default: false },
  },
  {
    collection: "user",
  }
);

const UserModel = mongoose.model("user", User);
module.exports = UserModel;