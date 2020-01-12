"use strict";

const express = require("express");
const app = express();
const http = require("http").Server(app);
const path = require("path");

const port = 3008;

require("./Controller/Mongoose");

//Socket io
require(path.join(__dirname, "Controller", "sockets")).listen(http);

app.use(express.static(path.join(__dirname, "Client")));

http.listen(port, () => {
  console.log(`\nListening at 127.0.0.1:${port}`);
});

//----------Connection au serveur central--------------//
// const socket = require("socket.io-client");
// let client = socket.connect("http://51.15.137.122:18000/", {
//   reconnect: true
// });

// client.on("connect", () => {
//   console.log("connected");

//   client.emit("sendUpdate");
//   client.on("projectUpdated", data => {
//     console.log(data);
//   });
//   client.on("errorOnProjectUpdate", data => {
//     console.log(data);
//   });
// });
//-----------------------------------------------------//
