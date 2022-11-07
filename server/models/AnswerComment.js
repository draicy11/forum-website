const mongoose = require("mongoose");

const answerCommentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  timestamps: true,
  author: { type: Schema.Types.ObjectId, ref: "User" },
  answer_id: { type: Schema.Types.ObjectId, ref: "Answer" },
});

module.exports = mongoose.model("AnswerComment", answerCommentSchema);