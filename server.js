"use strict";

const express = require("express");
const app = express();
const http = require("http").Server(app);
const path = require("path");

const port = 3000;

require("./Controller/Mongoose");

//Socket io
require(path.join(__dirname, "Controller", "sockets")).listen(http);

app.use(express.static(path.join(__dirname, "Client")));

http.listen(port, () => {
  console.log(`\nListening at 127.0.0.1:${port}`);
});
