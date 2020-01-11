"use strict";

const { Gantt } = require("./Mongoose");

const socketio = require("socket.io");

module.exports.listen = http => {
  const io = socketio(http);

  io.on("connection", socket => {
    console.log("New socket connected: ", socket.id);
    socket.emit("connection", "connected");

    socket.on("createGantt", data => {
     // console.log("client data: ", data);

      Gantt.createGantt(data).then((err, gantt) => {
        if (err) return console.error(err);
        io.emit("createGantt", gantt);
      });
    });

    socket.on("getGanttFromFront", nameService => {
      console.log("GETgantFromFront: ", nameService);

      Gantt.getGantt(nameService).then((gantt, err) => {
        if (err) return console.error('find error:', err);
        io.emit("getGantt", gantt);
      });
    });

    socket.on("updateGantt", (nameService, gantt) => {
      //console.log("nameService: ", nameService, "gantt: ", gantt);

      Gantt.updateGantt(nameService, gantt).then((err, gantt) => {
        if (err) return console.error(err);
        io.emit("updateGantt", gantt);
      });
    });
  });
};
