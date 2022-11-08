const cors = require("cors");
const bodyParser = require("body-parser");
const userAPI = require("../api/user-api");
const answerAPI = require("../api/answer-api");
const questionAPI = require("../api/question-api");
const answerCommentAPI = require("../api/answer-comment-api");
const questionCommentAPI = require("../api/question-comment-api");

module.exports = (app) => {
  // middleware
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }));

  // parse application/json
  app.use(bodyParser.json());

  // api

  app.use("/api/users", userAPI);
  app.use("/api/questions", questionAPI);
  app.use("/api/answers", answerAPI);
  app.use("/api/questioncomment", questionCommentAPI);
  app.use("/api/answercomment", answerCommentAPI);
};
