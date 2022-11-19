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
  answers_given: {
    type : [{type: Schema.Types.ObjectId, ref: "Answer"}],
    default : []
  },
  answer_comments : {
    type : [{type: Schema.Types.ObjectId, ref:"AnswerComment"}],
    default : []
  },
  question_comments : {
    type : [{type: Schema.Types.ObjectId, ref:"QuestionComment"}],
    default : []
  }
});

module.exports = mongoose.model("User", userSchema);
