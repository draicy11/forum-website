const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type : String,
    required: true,
  },
  questions_asked: {
    type : Number,
    default: 0,
  },
  questions_answered: {
    type : Number,
    default: 0,
  },
});

module.exports = mongoose.model("User", userSchema);
