const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
  name: {
    type : String,
    required: true,
  },
  questions_asked: {
    type : [{type: Schema.Types.ObjectId, ref: "Question"}],
    default : []
  },
  questions_answered: {
    type : [{type: Schema.Types.ObjectId, ref: "Question"}],
    default : []
  },
});

module.exports = mongoose.model("User", userSchema);
