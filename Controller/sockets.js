"use strict";

const { Gantt } = require("./Mongoose");

const socketio = require("socket.io");

module.exports.listen = http => {
  const io = socketio(http);

  io.on("connection", socket => {
    console.log("New socket connected: ", socket.id);
    socket.emit("connection", "connected");

    socket.on("createGantt", data => {
      Gantt.createGantt(data).then((err, gantt) => {
        if (err) return console.error(err);
        io.emit("createGantt", gantt);
        console.log("CREATE");
      });
    });

    socket.on("getGanttFromFront", (nameService = "AcquartGraça") => {
      Gantt.getGantt(nameService).then((res, err) => {
        if (err) return console.error("find error:", err);
        console.log("GET");
        io.emit("getGantt", res);
      });
    });

    socket.on("updateGanttToBack", (nameService, gantt) => {
      Gantt.updateGantt(nameService, gantt).then(err => {
        if (err) return console.error(err);
        io.emit("updateGanttToFront", "gantt updated");
        console.log("UPDATE");
      });
    });
  });
};
