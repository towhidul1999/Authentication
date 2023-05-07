const mongoose = require("mongoose");
require("dotenv").config;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Mongodb connection successfully");
  })
  .catch((error) => {
    console.log(error.message);
  });
