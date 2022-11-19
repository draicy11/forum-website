const userModel = require("../../models/User");
const questionModel = require("../../models/Question");
const deleteAnswer = require("./deleteAnswer");
const deleteQuestionComment = require("./deleteQuestionComment");

const result = {
  status: "",
  message: "",
};

module.exports = async function deleteQuestion(question_id) {
  // deleting the question
  return new Promise(async (resolve, reject) => {
    await questionModel
      .findByIdAndDelete(question_id)
      .then(async (question) => {
        if (!question) {
          result.status = 500;
          result.message = "something went wrong";
          reject(result);
        }
        // updating users' questions_asked
        await userModel
          .findByIdAndUpdate(question.user_id, {
            $pull: { questions_asked: { $in: [question_id] } },
          })
          .then((user) => {
            if (!user) {
              result.status = 500;
              result.message = "something went wrong";
              reject(result);
            }
          })
          .catch((err) => {
            result.status = 500;
            result.message = err.message;
            reject(result);
          });

        // delets every answer in this question
        question.answers.forEach(async (answer_id) => {
          await deleteAnswer(answer_id).catch((res) => {
            return res;
          });
        });

        // deletes every comment in this quesiton
        question.comments.forEach(async (comment_id) => {
          await deleteQuestionComment(comment_id).catch((res) => {
            return res;
          });
        });
        result.status = 200;
        result.message = "deleted question successfully";
        resolve(result);
      })
      .catch((err) => {
        result.status = 500;
        result.message = err.message;
        reject(result);
      });
  });
};
