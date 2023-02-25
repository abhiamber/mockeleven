require("dotenv").config();
let mongoose = require("mongoose");
mongoose.set("strictQuery", true);

let connect = () => {
  return mongoose.connect(process.env.DB_URL);
};

module.exports = connect;
