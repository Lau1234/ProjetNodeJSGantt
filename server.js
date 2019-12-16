"use strict";

const express = require("express");
const app = express();
const http = require("http").Server(app);
const path = require("path");

const port = 3000;

const ServerEvent = require(path.join(__dirname, "Controller", "ServerEvent"));

const Gantt = require(path.join(__dirname, "Controller", "Gantt"));

app.use("/gantt", Gantt.router);

require("./Controller/Mongoose");

//Socket io
require(path.join(__dirname, "Controller", "sockets")).listen(
  http,
  ServerEvent
);

app.use(express.static(path.join(__dirname, "Client")));

http.listen(port, () => {
  console.log(`\nListening at 127.0.0.1:${port}`);

  ServerEvent.emit("TEST");
});
