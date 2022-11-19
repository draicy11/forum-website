const answerCommentModel = require("../../models/AnswerComment");
const answerModel = require("../../models/Answer");
const userModel = require("../../models/User");
const result = {
  status: "",
  message: "",
};

module.exports = function deleteAnswerComment(comment_id) {
  return new Promise(async (resolve, reject) => {
    // deleting comment
    await answerCommentModel
      .findByIdAndDelete(comment_id)
      .then(async (comment) => {
        if (!comment) {
          result.status = 500;
          result.message = "something went wrong";
          reject(result);
        }
        // update user's comment array :

        await userModel
          .findByIdAndUpdate(comment.answer_id, {
            $pull: { answer_comments: { $in: [comment_id] } },
          })
          .catch((err) => {
            result.status = 500;
            result.message = err.message;
            reject(result);
          });

        // updates answer's comments

        await answerModel
          .findByIdAndUpdate(comment.answer_id, {
            $pull: { comments: { $in: [comment_id] } },
          })
          .catch((err) => {
            result.status = 500;
            result.message = err.message;
            reject(result);
          });
        result.status = 200;
        result.message = "deleted answer comment successfully";
        resolve(result);
      })
      .catch((err) => {
        result.status = 500;
        result.message = err.message;
        reject(result);
      });
  });
};
