const express = require("express");
const router = express.Router();
const userModel = require("../models/User");

// get one user

router.get("/get", async (req, res) => {
  if (!req.body) {
    res.status(500).json({ message: "body-parser not working" });
  }
  if (!req.body.user_id) {
    res.status(400).json({ message: "user_id not passed" });
  }
  const user_id = req.body.user_id;

  const user = await userModel
    .findOne({ id: user_id })
    // .populate('questions_asked')
    .then()
    .catch((err) => {
      res.status(404).json({ message: "user not found",error: err.message  });
    });
  res.status(200).json({ user: user });
});

// gets all the users

router.get("/getall", async (req, res) => {
  const users = await userModel
    .find()
    .then()
    .catch((err) => {
      res.status(404).json({ message: "user not found", error: err.message });
    });
  res.status(200).json({ users: users });
});

// creates a users

router.post("/create", async (req, res) => {
  if (!req.body) {
    res.status(500).json({ message: "body-parser not working" });
  }

  if (!req.body.name) {
    res.status(400).json({ message: "name not passed" });
  }
  const name = req.body.name;
  const user = new userModel({
    name: name,
  });
  await user
    .save()
    .then((u) => {
      return res.status(201).json({ message: "created user",user : u });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
});

// deletes a user

router.delete("/delete", async (req, res) => {
  if (!req.body) {
    res.status(500).json({ message: "body-parser not working" });
  }
  if (!req.body.user_id) {
    res.status(400).json({ message: "user_id not passed" });
  }
  const user_id = req.body.user_id;

  await userModel
    .findByIdAndDelete(user_id)
    .then((deleted_user) => {
      res.status(200).json({ message: "user deleted successfully" , deleted_user : deleted_user});
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

// deletes all the users

router.delete("/deleteall", async (req, res) => {
  await userModel
    .deleteMany()
    .then(() => {
      res.status(200).json({ message: "users deleted successfully" });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

// updates a user's name

router.patch("/updatename", async (req, res) => {
  if (!req.body) {
    res.status(500).json({ message: "body-parser not working" });
  }
  if (!req.body.user_id) {
    res.status(400).json({ message: "user_id not passed" });
  }
  if (!req.body.name) {
    res.status(400).json({ message: "name not passed" });
  }
  const user_id = req.body.user_id;
  const name = req.body.name;
  await userModel
    .findByIdAndUpdate(user_id, { name: name })
    .then((u) => {
      res
        .status(200)
        .json({ message: "updated successfully", user: u });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

module.exports = router;
