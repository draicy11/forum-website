const express = require("express");
const router = express.Router();

const userModel = require("../models/User");
const questionModel = require("../models/Question");

// get a question

router.get("/get", async (req, res) => {
  if (!req.body) {
    res.status(500).json({ message: "body-parser not working" });
  }
  if (!req.body.question_id) {
    res.status(400).json({ message: "question_id not passed" });
  }
  const question_id = req.body.question_id;
  const question = await questionModel.findById(question_id).catch((err) => {
    res.status(500).json({ message: err });
  });

  res.status(200).json({ question: question });
});

// get all the questions of a user

router.get("/getalluser", async (req, res) => {
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
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });

  res.status(200).json({ questions: user.questions_asked });
});

// get all the questions

router.get("/getall", async (req, res) => {
  const questions = await questionModel.find().catch((err) => {
    res.status(500).json({ message: err });
  });

  res.status(200).json({ questions: questions });
});

// create a question

router.post("/create", async (req, res) => {
  if (!req.body) {
    res.status(500).json({ message: "body-parser not working" });
  }

  if (!req.body.user_id) {
    res.status(400).json({ message: "user_id not passed" });
  }
  const user_id = req.body.user_id;
  if (!req.body.content) {
    res.status(400).json({ message: "content not passed" });
  }
  const content = req.body.content;
  const question = new questionModel({
    content: content,
    author: user_id,
  });
  await question
    .save()
    .then(async (q) => {
      // update user's question asked
      await userModel.findByIdAndUpdate(user_id, {
        $push: { questions_asked: q._id },
      });
      res.status(201).json({ message: "question created", question: q });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

// delete a question
router.delete("/delete", async (req, res) => {
  if (!req.body) {
    res.status(500).json({ message: "body-parser not working" });
  }

  if (!req.body.question_id) {
    res.status(400).json({ message: "question_id not passed" });
  }
  const question_id = req.body.question_id;
  await questionModel
    .findByIdAndDelete(question_id)
    .then(async (question) => {
      await userModel
        .findByIdAndUpdate(question.user_id, {
          $pull: { questions_asked: { $in: [question_id] } },
        })
        .catch((err) => {
          res.status(500).json({ message: err.message });
        });
      res
        .status(200)
        .json({ message: "deleted successfully", deleted_question: question });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

// delete all the questions by a user

router.delete("/deletealluser", async (req, res) => {
  if (!req.body) {
    res.status(500).json({ message: "body-parser not working" });
  }

  if (!req.body.user_id) {
    res.status(400).json({ message: "user_id not passed" });
  }
  const user_id = req.body.user_id;
  userModel
    .findById(user_id)
    .then(async (user) => {
      await questionModel
        .deleteMany({ _id: { $in: user.questions_asked } })
        .then(async (result) => {
          user.questions_asked = [];
          await user.save().catch((err) => {
            res.status(500).json({ message: err.message });
          });
          res.status(200).json({
            message: "deleted questions",
            deleted_count: result.deletedCount,
          });
        })
        .catch((err) => {
          res.status(500).json({ message: err.message });
        });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

// delete all the questions

router.delete("/deleteall", async (req, res) => {
  await questionModel
    .deleteMany()
    .then((result) => {
      res.status(200).json({
        message: "questions deleted successfully",
        deletedCount: result.deletedCount,
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

// update a question
router.patch("/update", async (req, res) => {
  if (!req.body) {
    res.status(500).json({ message: "body-parser not working" });
  }

  if (!req.body.question_id) {
    res.status(400).json({ message: "question_id not passed" });
  }

  if (!req.body.new_content) {
    res.status(400).json({ message: "new_content not passed" });
  }

  const question_id = req.body.question_id;
  const new_content = req.body.new_content;

  await questionModel
    .findByIdAndUpdate(question_id, { content: new_content })
    .then(() => {
      res.status(200).json({ message: "updated successfully" });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});
module.exports = router;
