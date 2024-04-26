const mongoose = require("mongoose");

const connectToDB = (connectionString) => {
  return mongoose.connect(connectionString);
};
module.exports = connectToDB;
