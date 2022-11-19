const mongoose = require("mongoose");
const { Schema } = mongoose;

const questionSchema = new mongoose.Schema(
  {
    upVotes: {
      type: Number,
      default: 0,
    },
    content: { type: String, required: true },
    user_id: { type: Schema.Types.ObjectId, ref: "User",required: true},
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment", default: [] }],
    answers: [{ type: Schema.Types.ObjectId, ref: "Answer", default: [] }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);
