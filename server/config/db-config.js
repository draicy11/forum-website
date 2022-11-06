const mongoose = require("mongoose");
const CONNECT_URL =
  "mongodb+srv://draicy:poiuy@keeper-data.wqyru.mongodb.net/forumDB";
mongoose
  .connect(CONNECT_URL)
  .then(() => console.log("DB connected"))
  .catch((err) => console.error(err));

