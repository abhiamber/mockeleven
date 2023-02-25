let { Schema, model } = require("mongoose");

let userSchema = new Schema(
  {
    image: String,
    Name: String,
    Bio: String,
    Phone: String,
    Email: String,
    Password: String,
  },
  { versionKey: false }
);

let UserModel = model("user", userSchema);
module.exports = UserModel;
