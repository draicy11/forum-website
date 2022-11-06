const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  upVotes: {
    type: Number,
    default: 0,
  },
  content: { type: String, required: true },
  timestamps: true,
  author: { type: Schema.Types.ObjectId, ref: "User" },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  answers: [{ type: Schema.Types.ObjectId, ref: "Answer" }],
});

module.exports = mongoose.model("Question", questionSchema);
