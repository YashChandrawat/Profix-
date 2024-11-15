const mongoose = require("mongoose");
require("dotenv").config();

exports.dbConnect = () => {
  mongoose
    .connect(process.env.DB_URL)
    .then(() => console.log("DB Connected Successfully"))
    .catch((err) => {
      console.log("DB Connection Failed");
      console.error(err);
      process.exit(1); // Exit the process if the DB connection fails
    });
};
