const express = require("express");
const router = express.Router();

const answerModel = require("../models/Answer");
const userModel = require("../models/User");
const questionModel = require("../models/Question");
const deleteAnswer = require("../utils/delete/deleteAnswer");

// get a specific answer

router.get("/", async (req, res) => {
  if (!req.body) {
    return res.status(500).json({ message: "body-parser not working" });
  }

  if (!req.body.answer_id) {
    return res.status(400).json({ message: "answer_id not passed" });
  }
  const answer_id = req.body.answer_id;

  await answerModel
    .findById(answer_id)
    .then((answer) => {
      if (!answer) {
        return res.status(500).json({ message: "something went wrong." });
      }
      return res.status(200).json({ answer: answer });
    })
    .catch((err) => {
      return res.status(404).json({ error: err.message });
    });
});
// get answers to a question

router.get("/get-answers-to-question", async (req, res) => {
  if (!req.body) {
    return res.status(500).json({ message: "body-parser not working" });
  }

  if (!req.body.question_id) {
    return res.status(400).json({ message: "question_id not passed" });
  }
  const question_id = req.body.question_id;
  await questionModel
    .findById(question_id)
    .populate("answers")
    .then((question) => {
      if (!question) {
        return res.status(500).json({ message: "something went wrong." });
      }
      return res.status(200).json({ answers: question.answers });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
});

// get answers to a question by a user

router.get("/get-answers-to-question-by-user", async (req, res) => {
  if (!req.body) {
    return res.status(500).json({ message: "body-parser not working" });
  }

  if (!req.body.question_id) {
    return res.status(400).json({ message: "question_id not passed" });
  }
  const question_id = req.body.question_id;

  if (!req.body.user_id) {
    return res.status(400).json({ message: "user_id not passed" });
  }
  const user_id = req.body.user_id;

  await answerModel
    .find({ question_id: question_id, user_id: user_id })
    .then((answers) => {
      if (!answers) {
        return res.status(500).json({ message: "something went wrong." });
      }
      return res.status(200).json({ answers: answers });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
});

// get all the answers by a user

router.get("/getall-by-user", async (req, res) => {
  if (!req.body) {
    return res.status(500).json({ message: "body-parser not working" });
  }

  if (!req.body.user_id) {
    return res.status(400).json({ message: "user_id not passed" });
  }
  const user_id = req.body.user_id;

  await answerModel
    .find({ user_id: user_id })
    .then((answers) => {
      if (!answers) {
        return res.status(500).json({ message: "something went wrong." });
      }
      return res.status(200).json({ answers: answers });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
});

// get all the answers

router.get("/getall", async (req, res) => {
  await answerModel
    .find()
    .then((answers) => {
      if (!answers) {
        return res.status(500).json({ message: "something went wrong." });
      }
      return res.status(200).json({ answers: answers });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
});

// answer a question

router.post("/", async (req, res) => {
  if (!req.body) {
    return res.status(500).json({ message: "body-parser not working" });
  }
  if (!req.body.user_id) {
    return res.status(400).json({ message: "user_id not passed" });
  }
  const user_id = req.body.user_id;
  if (!req.body.question_id) {
    return res.status(400).json({ message: "question_id not passed" });
  }
  const question_id = req.body.question_id;

  if (!req.body.content) {
    return res.status(400).json({ message: "content not passed" });
  }
  const content = req.body.content;

  const answer = new answerModel({
    content: content,
    user_id: user_id,
    question_id: question_id,
  });

  await answer
    .save()
    .then(async (result) => {
      await userModel
        .findByIdAndUpdate(user_id, {
          $push: { answers_given: result._id },
        })
        .catch((err) => {
          return res
            .status(500)
            .json({ message: "user not update", error: err.message });
        });
      await questionModel
        .findByIdAndUpdate(question_id, {
          $push: { answers: result.id },
        })
        .catch((err) => {
          return res
            .status(500)
            .json({ message: "question not update", error: err.message });
        });
      return res.status(200).json({
        message: "answered the question successfully",
        response: result,
      });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
});
// edit an answer

router.patch("/", async (req, res) => {
  if (!req.body) {
    return res.status(500).json({ message: "body-parser not working" });
  }

  if (!req.body.answer_id) {
    return res.status(400).json({ message: "answer_id not passed" });
  }
  const answer_id = req.body.answer_id;

  if (!req.body.new_content) {
    return res.status(400).json({ message: "new_content not passed" });
  }
  const new_content = req.body.new_content;

  await answerModel
    .findByIdAndUpdate(answer_id, { content: new_content })
    .then((result) => {
      if (!result) {
        return res.status(500).json({ message: "something went wrong." });
      }
      return res
        .status(200)
        .json({ message: "updated successfully", result: result });
    })
    .catch((err) => {
      return res.status(500).json({ message: err.message });
    });
});
// delete a specific answer

router.delete("/", async (req, res) => {
  if (!req.body) {
    return res.status(500).json({ message: "body-parser not working" });
  }

  if (!req.body.answer_id) {
    return res.status(400).json({ message: "answer_id not passed" });
  }
  const answer_id = req.body.answer_id;
  await deleteAnswer(answer_id)
    .then((result) => {
      if (!result) {
        return res.status(500).json({ message: "something went wrong." });
      }
      return res.status(200).json({ message: result.message });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
});

// delete all the answers

router.delete("/deleteall", async (req, res) => {
  await answerModel
    .find()
    .then((answers) => {
      if (!answers) {
        return res.status(500).json({ message: "something went wrong." });
      }
      answers.forEach(async (answer) => {
        await deleteAnswer(answer._id).catch((err) => {
          return res.status(500).json({ message: err.message });
        });
      });

      return res.status(200).json({ message: "deleted answers successfully" });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
});
// delete all the answers by a user

router.delete("/delete-all-by-user", async (req, res) => {
  if (!req.body) {
    return res.status(500).json({ message: "body-parser not working" });
  }

  if (!req.body.user_id) {
    return res.status(400).json({ message: "user_id not passed" });
  }
  const user_id = req.body.user_id;

  await userModel.findById(user_id).then(async (user) => {
    if (!user) {
      return res.status(500).json({ message: "user not found" });
    }
    // delets every answers by this user
    user.answers_given.forEach(async (answer_id) => {
      await deleteAnswer(answer_id).catch((res) => {
        return res;
      });
    });
  });
});

module.exports = router;
