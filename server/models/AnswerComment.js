const mongoose = require("mongoose");
const { Schema } = mongoose;

const answerCommentSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },

    author: { type: Schema.Types.ObjectId, ref: "User" },
    answer_id: { type: Schema.Types.ObjectId, ref: "Answer" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AnswerComment", answerCommentSchema);
