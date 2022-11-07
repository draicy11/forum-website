const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  upVotes: {
    type: Number,
    default: 0,
  },
  downVotes: {
    type: Number,
    default: 0,
  },
  content: { type: String, required: true },
  timestamps: true,
  author: { type: Schema.Types.ObjectId, ref: "User" },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  question_id: { type: Schema.Types.ObjectId, ref: "Question" },
});

module.exports = mongoose.model("Answer", answerSchema);
