const userModel = require("../../models/User");
const answerModel = require("../../models/Answer");
const questionModel = require("../../models/Question");
const deleteAnswerComment = require("./deleteAnswerComment");

const result = {
  status: "",
  message: "",
};

module.exports = async function (answer_id) {
  return new Promise(async (resolve, reject) => {
    // deleting the answer
    await answerModel
      .findByIdAndDelete(answer_id)
      .then(async (answer) => {
        if (!answer) {
          result.status = 500;
          result.message = "something went wrong";
          reject(result);
        }
        // updating users' answers_given
        await userModel
          .findByIdAndUpdate(answer.user_id, {
            $pull: { answers_given: { $in: [answer_id] } },
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

        // updating questions' answers

        await questionModel
          .findByIdAndUpdate(answer.question_id, {
            $pull: { answers: { $in: [answer_id] } },
          })
          .catch((err) => {
            result.status = 500;
            result.message = err.message;
            reject(result);
          });

        // deleting all the comments on this answer

        answer.comments.forEach(async (comment) => {
          await deleteAnswerComment(comment._id).catch((res) => {
            return res;
          });
        });

        result.status = 200;
        result.message = "deleted answer successfully";
        resolve(result);
      })
      .catch((err) => {
        result.status = 500;
        result.message = err.message;
        reject(result);
      });
  });
};
