const questionCommentModel = require("../../models/QuestionComment");
const questionModel = require("../../models/Question");

const result = {
  status: "",
  message: "",
};

module.exports = function deleteQuestionComment(comment_id) {
  // deleting comment

  return new Promise(async (resolve, reject) => {
    await questionCommentModel
    .findByIdAndDelete(comment_id)
    .then(async (comment) => {
      if (!comment) {
        result.status = 500;
        result.message = "something went wrong";
        reject('result');
      }

      // update user's comment array :

      await userModel
      .findByIdAndUpdate(comment.answer_id, {
        $pull: { question_comments: { $in: [comment_id] } },
      })
      .catch((err) => {
        result.status = 500;
        result.message = err.message;
        reject(result);
      });

      // updates question's comments

      await questionModel
        .findByIdAndUpdate(comment.question_id, {
          $pull: { comments: { $in: [comment_id] } },
        })
        .catch((err) => {
          result.status = 500;
        result.message = err.message;
        reject('result');
        });
        result.status = 200;
        result.message = "deleted question comment successfully";
        resolve('result');
    })
    .catch((err) => {
      result.status = 500;
        result.message = err.message;
        reject('result');
    });
  })

};
