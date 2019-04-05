const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const mongoose = require("mongoose");
const port = process.env.PORT || 3002;

require("dotenv").config();

mongoose.connect(
  process.env.DATABASE,
  { useNewUrlParser: true, useCreateIndex: true },
  err => {
    if (err) return err;
    console.log("conectado a Mongo");
  }
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const { User } = require("./models/User.js");

const { auth } = require("./middleware/auth");

app.get("/api/users/auth", auth, (req, res) => {
  res.status(200).json({
    user: req.user
  });
});

app.post("/api/users/register", (req, res, next) => {
  const user = new User(req.body);
  user.save((err, doc) => {
    if (err) return res.json({ success: false, err });

    res.status(200).json({
      success: true,
      userdata: doc
    });
  });
});

app.post("/api/users/login", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user)
      return res.json({
        loginSuccess: false,
        message: "Auth fallida, email no encontrado"
      });
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({ loginSuccess: false, message: "Password erroneo" });

      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        res
          .cookie("guitarshop_auth", user.token)
          .status(200)
          .json({ loginSuccess: true });
      });
    });
  });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});
