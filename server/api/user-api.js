const express = require("express");
const router = express.Router();
const userModel = require("../models/User");

// get one user

router.get("/get", async (req, res) => {
  if (!req.body) {
    res.status(500).json({ message: "body-parser not working" });
  }
  if (!req.body.id) {
    res.status(400).json({ message: "id not passed" });
  }
  const id = req.body.id;

  const user = await userModel
    .findOne({ _id: id })
    .then()
    .catch((err) => {
      res.status(404).json({ message: "user not found" }, { error: err });
    });
  res.status(200).json({user : user});
});

// gets all the users

router.get("/getall", async (req, res) => {
  const users = await userModel
    .find()
    .then()
    .catch((err) => {
      res.status(404).json({ message: "user not found", error: err });
    });
  res.status(200).json({users : users});
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
    .then(() => {
      return res.status(201).json({message : "created user"});
    })
    .catch((err) => {
      return res.status(500).json({ error: err });
    });
});

// deletes a user

router.delete("/delete", async (req, res) => {
  if (!req.body) {
    res.status(500).json({ message: "body-parser not working" });
  }
  if (!req.body.id) {
    res.status(400).json({ message: "id not passed" });
  }
  const id = req.body.id;

  await userModel
    .findByIdAndDelete(id)
    .then(() => {
      res.status(204).json({message : "user deleted successfully"});
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

// deletes all the users

router.delete("/deleteall", async (req, res) => {
  await userModel
    .deleteMany()
    .then(() => {
      res.status(204).json({message : "users deleted successfully"});
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

// updates a user

// router.patch("/update", async (req, res) => {
//   if (!req.body) {
//     res.status(500).json({ message: "body-parser not working" });
//   }
//   if (!req.body.id) {
//     res.status(400).json({ message: "id not passed" });
//   }
//   const id = req.body.id;
//   const updates = {};
//   await userModel
//     .findByIdAndUpdate(id, updates)
//     .then((result) => {
//       res
//         .status(204)
//         .json({ message: "updated successfully", response: result });
//     })
//     .catch((err) => {
//       res.status(500).json({ error: err });
//     });
// });

module.exports = router;
