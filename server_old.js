"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const http = require("http").Server(app);
const path = require("path");

require("./Controller/Mongoose");

var cors = require("cors");

const port = 3000;

const Gantt = require(path.join(__dirname, "Controller", "Gantt"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use("/gantt", Gantt.router);
app.use(express.static(path.join(__dirname, "Client")));

http.listen(port, () => {
  console.log(`\nListening at 127.0.0.1:${port}`);
});

//----------Connection au serveur central--------------//
const socket = require("socket.io-client");
let client = socket.connect("Adresse IP bientôt disponnible", {
  reconnect: true
}); // L'adresse IP vous sera communiqué dans un mail ultérieur

client.on("connect", () => {
  console.log("connected");

  client.emit("needHelp");
});
//-----------------------------------------------------//
