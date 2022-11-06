const express = require("express");
const app = express();
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