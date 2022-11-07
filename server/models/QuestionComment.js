const mongoose = require("mongoose");

const questionCommentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  timestamps: true,
  author: { type: Schema.Types.ObjectId, ref: "User" },
  question_id: { type: Schema.Types.ObjectId, ref: "Question" },
});

module.exports = mongoose.model("QusetionComment", questionCommentSchema);
