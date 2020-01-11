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

//----------Connection au serveur central--------------//
const socket = require("socket.io-client");
let client = socket.connect("http://51.15.137.122:18000/", {
  reconnect: true
}); // L'adresse IP vous sera communiqué dans un mail ultérieur

const gantt = {
  nameService: "Demo",
  projects: [
    {
      name: "projet de test",
      desc: "Description du projet, blablabla...",
      daysOff: {
        Mo: true,
        Tu: true,
        We: true,
        Th: true,
        Fr: true,
        Sa: false,
        Su: false
      },
      workingHours: { start: 0, end: 0 },
      task: [
        {
          id: 0,
          name: "tache 1",
          desc: "toto",
          start: 1491680626329,
          end: 1491684607029,
          percentageProgress: 50,
          color: "#fc0202",
          linkedTask: [],
          ressources: []
        }
      ],
      groupTask: [{ name: "optional", start: Date.now(), end: Date.now() }],
      resources: [{ name: "Jérémy", cost: 500, type: "humain" }],
      milestones: [{ name: "jalon °1", date: Date.now() }]
    }
  ]
};
client.on("connect", () => {
  console.log("connected");

  //   client.emit("sendUpdate", gantt);
  //   client.on("projectUpdated", data => {
  //     console.log(data);
  //   });
  //   client.on("errorOnProjectUpdate", data => {
  //     console.log(data);
  //   });
});
//-----------------------------------------------------//
