const mongoose = require("mongoose");
const { Schema } = mongoose;

const questionCommentSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },

    author: { type: Schema.Types.ObjectId, ref: "User" },
    question_id: { type: Schema.Types.ObjectId, ref: "Question" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("QusetionComment", questionCommentSchema);
