"use strict";
// Initialisation des constantes
const { Gantt } = require("./Mongoose");
const socketio = require("socket.io");
// ------------------------------

// Gestion des sockets -------------------
module.exports.listen = http => {
  const io = socketio(http);
  // Connection
  io.on("connection", socket => {
    console.log("New socket connected: ", socket.id);

    //----------Connection au serveur central--------------//
    const socketCentral = require("socket.io-client");
    let client = socketCentral.connect("http://51.15.137.122:18000/", {
      reconnect: true
    });

    client.on("connect", () => {
      console.log("connected");

      client.emit("sendUpdate");
      client.on("projectUpdated", data => {
        socket.emit("connection", data);
      });
      client.on("errorOnProjectUpdate", data => {
        console.log("errorOnProjectUpdate:", data);
      });
    });
    //-----------------------------------------------------//

    //Création du gantt
    socket.on("createGantt", data => {
      Gantt.createGantt(data).then((err, gantt) => {
        if (err) return console.error(err);
        io.emit("createGantt", gantt);
        console.log("CREATE");
      });
    });
    //Affichage du gantt
    socket.on("getGanttFromFront", (nameService = "AcquartGraça") => {
      Gantt.getGantt(nameService).then((res, err) => {
        if (err) return console.error("find error:", err);
        console.log("GET TO FRONT",res);
        io.emit("getGantt", res);
      });
    });
    //Update du gantt
    socket.on("updateGanttToBack", (nameService, gantt) => {
      Gantt.updateGantt(nameService, gantt).then(err => {
        if (err) return console.error(err);
        io.emit("updateGanttToFront", "gantt updated");
        console.log("UPDATE");
      });
    });
  });
};
// ---------------------------------------------------
