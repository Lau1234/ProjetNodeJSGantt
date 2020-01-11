"use strict";

const { Gantt } = require("./Mongoose");

const socketio = require("socket.io");

module.exports.listen = http => {
  const io = socketio(http);

  io.on("connection", socket => {
    console.log("New socket connected: ", socket.id);
    socket.emit("connection", "test");
    socket.on("createGantt", data => {
      console.log("client data: ", data);

      Gantt.createGantt(data).then((err, gantt) => {
        if (err) return console.error(err);
        io.emit("createGantt", gantt);
      });
    });
  });
};
