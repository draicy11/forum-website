const express = require("express");
const app = express();
const userModel = require("./models/User");
// middleware
require("./config/middleware-config");

// database
require("./config/db-config");

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
