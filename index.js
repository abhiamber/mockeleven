const express = require("express");
require("dotenv").config();
let PORT = process.env.PORT || 8080;
let jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
let saltRounds = process.env.saltRounds || 10;
let KEY = process.env.KEY;
let connect = require("./config/db");
let cors = require("cors");
let app = express();
app.use(express.json());
app.use(cors());
let UserModel = require("./model/user.model");

// **************testing******
app.get("/", async (req, res) => {
  res.send("Hurray !");
});

// ***************register user***********

app.post("/register", async (req, res) => {
  let { image, Name, Bio, Phone, Email, Password } = req.body;

  let user = await UserModel.findOne({ Email });

  if (user) {
    return res.send({ messg: "use Different email", ok: "NOT" });
  }

  try {
    bcrypt.hash(Password, 8, async function (err, hash) {
      if (err) {
        return res.send({ messg: err.message, ok: "NOT" });
      }
      // Store hash in your password DB.

      let newUser = new UserModel({
        image,
        Name,
        Bio,
        Phone,
        Email,
        Password: hash,
      });
      await newUser.save();
      res.send({ meesg: "User Registered", ok: "OK" });
    });
  } catch (e) {
    console.log(e.message);
    res.send({ messg: e.message, ok: "NOT" });
  }
});

// ***************Login user***********

app.post("/login", async (req, res) => {
  let { Email, Password } = req.body;

  let user = await UserModel.findOne({ Email });

  if (!user) {
    return res.send({ messg: "Invalid Crediantials", ok: "NOT" });
  }

  try {
    bcrypt.compare(Password, user.Password, function (err, result) {
      if (err) {
        return res.send({ messg: err.message, ok: "NOT" });
      }
      if (result) {
        let token = jwt.sign({ id: user._id, email: user.Email }, KEY);
        res.send({ meesg: token, ok: "OK" });
      } else {
        return res.send({ messg: "Invalid Crediantials", ok: "NOT" });
      }
    });
  } catch (e) {
    console.log(e.message);
    res.send({ messg: e.message, ok: "NOT" });
  }
});

// *****************get profile details-******************

app.get("/getProfile", async (req, res) => {
  let { token } = req.headers;

  try {
    var decoded = jwt.verify(token, KEY);
    console.log(token);
    console.log(decoded);

    if (!decoded) {
      return res.send({ messg: "Invalid Crediantials", ok: "NOT" });
    }
    let user = await UserModel.findOne({ _id: decoded.id });

    res.send({ meesg: user, ok: "OK" });
  } catch (e) {
    return res.send({ messg: e.messgae, ok: "NOT" });
  }
});

// *****************Edit profile details-******************

app.patch("/edit", async (req, res) => {
  let { image, Name, Bio, Phone, Email, Password } = req.body;

  let { token } = req.headers;

  try {
    var decoded = jwt.verify(token, KEY);
    console.log(token);
    console.log(decoded);

    if (!decoded) {
      return res.send({ messg: "Invalid Crediantials", ok: "NOT" });
    }
    let user = await UserModel.findByIdAndUpdate(decoded.id, {
      image,
      Name,
      Bio,
      Phone,
      Email,
      Password,
    });

    res.send({ meesg: "updated", ok: "OK" });
  } catch (e) {
    return res.send({ messg: e.messgae, ok: "NOT" });
  }
});

app.listen(PORT, async () => {
  await connect();
  console.log("server working");
});
