const express = require("express");
const app = express();
const configure_middleware = require('./config/middleware-config')



// database
require("./config/db-config");

// middleware
configure_middleware(app);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
