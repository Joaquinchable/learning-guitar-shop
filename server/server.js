const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const mongoose = require("mongoose");
const port = process.env.PORT || 3002;

require("dotenv").config();
mongoose.connect(process.env.DATABASE, { useNewUrlParser: true }, err => {
  if (err) return err;
  console.log("conectado a Mongo");
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const { User } = require("./models/User.js");

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

app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});
