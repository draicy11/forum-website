const userModel = require("../../models/User");
const questionModel = require("../../models/Question");
const deleteAnswer = require("./deleteAnswer");
const deleteQuestionComment = require("./deleteQuestionComment");
const deleteQuestion = require("./deleteQuestion");

const result = {
  status: "",
  message: "",
};

module.exports = async function deleteUser(user_id) {
  // deleting the user
  return new Promise(async (resolve, reject) => {
    await userModel
      .findByIdAndDelete(user_id)
      .then(async (user) => {
        if (!user) {
          result.status = 500;
          result.message = "something went wrong";
          reject(result);
        }
        

        // delets every answer answered by this user
        user.answers_given.forEach(async (answer_id) => {
          await deleteAnswer(answer_id).catch((res) => {
            return res;
          });
        });

        // delets every question asked by this user
        user.questions_asked.forEach(async (question_id) => {
            await deleteQuestion(question_id).catch((res) => {
              return res;
            });
          });
        
        result.status = 200;
        result.message = "deleted user successfully";
        resolve(result);
      })
      .catch((err) => {
        result.status = 500;
        result.message = err.message;
        reject(result);
      });
  });
};
