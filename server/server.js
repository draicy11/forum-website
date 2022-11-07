const express = require("express");
const app = express();

// middleware
const cors = require("cors");
const bodyParser = require("body-parser");

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

// database
require("./config/db-config");

// api

const userAPI = require("./api/user-api");
const answerAPI = require("./api/answer-api");
const questionAPI = require("./api/question-api");
const answerCommentAPI = require("./api/answer-comment-api");
const questionCommentAPI = require("./api/question-comment-api");

app.use("/api/users", userAPI);
app.use("/api/questions", questionAPI);
app.use("/api/answers", answerAPI);
app.use("/api/questioncomment", questionCommentAPI);
app.use("/api/answercomment", answerCommentAPI);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
