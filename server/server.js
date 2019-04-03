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

app.post("http://localhost:3002/api/users", (req, res, next) => {
  res.status(200).send("todo chido");
});

app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});
