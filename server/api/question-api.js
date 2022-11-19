const express = require("express");
const router = express.Router();

const userModel = require("../models/User");
const questionModel = require("../models/Question");
const deleteQuestion = require("../utils/delete/deleteQuestion");
// get a question

router.get("/", async (req, res) => {
  if (!req.body) {
    return res.status(500).json({ message: "body-parser not working" });
  }
  if (!req.body.question_id) {
    return res.status(400).json({ message: "question_id not passed" });
  }
  const question_id = req.body.question_id;
  await questionModel
    .findById(question_id)
    .then((question) => {
      if (!question) {
        return res.status(500).json({ message: "something went wrong." });
      }
      return res.status(200).json({ question: question });
    })
    .catch((err) => {
      return res.status(500).json({ message: err.message });
    });
});

// get all the questions of a user

router.get("/getall-questions-by-user", async (req, res) => {
  if (!req.body) {
    res.status(500).json({ message: "body-parser not working" });
  }

  if (!req.body.user_id) {
    res.status(400).json({ message: "user_id not passed" });
  }
  const user_id = req.body.user_id;

  const user = await userModel
    .findById(user_id)
    .populate("questions_asked")
    .then((user) => {
      if (!user) {
        return res.status(500).json({ message: "something went wrong." });
      }
      return res.status(200).json({ questions: user.questions_asked });
    })
    .catch((err) => {
      return res.status(500).json({ message: err.message });
    });
});

// get all the questions

router.get("/getall", async (req, res) => {
  const questions = await questionModel
    .find()
    .then((questions) => {
      if (!questions) {
        return res.status(500).json({ message: "something went wrong." });
      }
      return res.status(200).json({ questions: questions });
    })
    .catch((err) => {
      return res.status(500).json({ message: err.message });
    });
});

// create a question

router.post("/", async (req, res) => {
  if (!req.body) {
    return res.status(500).json({ message: "body-parser not working" });
  }

  if (!req.body.user_id) {
    return res.status(400).json({ message: "user_id not passed" });
  }
  const user_id = req.body.user_id;
  if (!req.body.content) {
    return res.status(400).json({ message: "content not passed" });
  }
  const content = req.body.content;
  const question = new questionModel({
    content: content,
    user_id: user_id,
  });
  await question
    .save()
    .then(async (q) => {
      if (!q) {
        return res.status(500).json({ message: "something went wrong." });
      }
      // update user's question asked
      await userModel.findByIdAndUpdate(user_id, {
        $push: { questions_asked: q._id },
      });
      return res.status(201).json({ message: "question created", question: q });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
});

// delete a question
router.delete("/", async (req, res) => {
  if (!req.body) {
    return res.status(500).json({ message: "body-parser not working" });
  }

  if (!req.body.question_id) {
    return res.status(400).json({ message: "question_id not passed" });
  }
  const question_id = req.body.question_id;
  await deleteQuestion(question_id)
    .then((result) => {
      return res.status(200).json({ message: result.message });
    })
    .catch((err) => {
      return res.status(500).json({ message: err.message });
    });
});

// delete all the questions by a user

router.delete("/deleteall-questions-by-user", async (req, res) => {
  if (!req.body) {
    return res.status(500).json({ message: "body-parser not working" });
  }

  if (!req.body.user_id) {
    return res.status(400).json({ message: "user_id not passed" });
  }
  const user_id = req.body.user_id;
  userModel
    .findById(user_id)
    .then(async (user) => {
      user.questions_asked.forEach(async (question_id) => {
        await deleteQuestion(question_id).catch((err) => {
          res.status(500).json({ message: err.message });
        });
      });
      return res.status(200).json({ message: "deleted questions successfully" });
    })
    .catch((err) => {
      return res.status(500).json({ message: err.message });
    });
});

// delete all the questions

router.delete("/deleteall", async (req, res) => {
  await questionModel
    .find()
    .then((questions) => {
      questions.forEach(async (question) => {
        await deleteQuestion(question._id).catch((err) => {
          return res.status(500).json({ message: err.message });
        });
        return res.status(200).json({ message: "deleted questions successfully" });
      });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
});

// update a question
router.patch("/", async (req, res) => {
  if (!req.body) {
    return res.status(500).json({ message: "body-parser not working" });
  }

  if (!req.body.question_id) {
    return res.status(400).json({ message: "question_id not passed" });
  }

  if (!req.body.new_content) {
    return res.status(400).json({ message: "new_content not passed" });
  }

  const question_id = req.body.question_id;
  const new_content = req.body.new_content;

  await questionModel
    .findByIdAndUpdate(question_id, { content: new_content })
    .then(() => {
      return res.status(200).json({ message: "updated successfully" });
    })
    .catch((err) => {
      return res.status(500).json({ message: err.message });
    });
});
module.exports = router;
