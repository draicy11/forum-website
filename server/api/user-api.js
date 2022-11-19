const express = require("express");
const router = express.Router();
const userModel = require("../models/User");
const deleteUser = require("../utils/delete/deleteUser");
// get one user

router.get("/", async (req, res) => {
  if (!req.body) {
    return res.status(500).json({ message: "body-parser not working" });
  }
  if (!req.body.user_id) {
    return res.status(400).json({ message: "user_id not passed" });
  }
  const user_id = req.body.user_id;

  await userModel
    .findOne({ id: user_id })
    .then((user) => {
      if (!user) {
        return res.status(500).json({ message: "something went wrong." });
      }
      return res.status(200).json({ user: user });
    })
    .catch((err) => {
      return res.status(404).json({ message: "user not found", error: err.message });
    });
});

// gets all the users

router.get("/getall", async (req, res) => {
  await userModel
    .find()
    .then((users) => {
      if (!users) {
        return res.status(500).json({ message: "something went wrong." });
      }
      return res.status(200).json({ user: users });
    })
    .catch((err) => {
      return res.status(404).json({ message: "user not found", error: err.message });
    });
  
});

// creates a users

router.post("/", async (req, res) => {
  if (!req.body) {
    return res.status(500).json({ message: "body-parser not working" });
  }

  if (!req.body.name) {
    return res.status(400).json({ message: "name not passed" });
  }
  const name = req.body.name;
  const user = new userModel({
    name: name,
  });
  await user
    .save()
    .then((u) => {
      if (!u) {
        return res.status(500).json({ message: "something went wrong." });
      }
      return res.status(201).json({ message: "created user", user: u });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
});

// deletes a user

router.delete("/", async (req, res) => {
  if (!req.body) {
    return res.status(500).json({ message: "body-parser not working" });
  }
  if (!req.body.user_id) {
    return res.status(400).json({ message: "user_id not passed" });
  }
  const user_id = req.body.user_id;

  await deleteUser(user_id)
    .then((result) => {
      return res.status(200).json({ message: result.message });
    })
    .catch((err) => {
      return res.status(500).json({ message: err.message });
    });
});

// deletes all the users

router.delete("/deleteall", async (req, res) => {
  await userModel
    .find()
    .then((users) => {
      users.forEach(async (user) => {
        await deleteUser(user._id).catch((err) => {
          return res.status(500).json({ message: err.message });
        });
        return res.status(200).json({ message: "deleted users successfully" });
      });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
});

// updates a user's name

router.patch("/", async (req, res) => {
  if (!req.body) {
    return res.status(500).json({ message: "body-parser not working" });
  }
  if (!req.body.user_id) {
    return res.status(400).json({ message: "user_id not passed" });
  }
  if (!req.body.name) {
    return res.status(400).json({ message: "name not passed" });
  }
  const user_id = req.body.user_id;
  const name = req.body.name;
  await userModel
    .findByIdAndUpdate(user_id, { name: name })
    .then((u) => {
      if (!u) {
        return res.status(500).json({ message: "something went wrong." });
      }
      res.status(200).json({ message: "updated successfully", user: u });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

module.exports = router;
