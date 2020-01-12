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

      client.on("projectUpdated", data => {
        console.log("central data:", data);
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
        io.emit("getGantt", res);
      });
    });
    //Update du gantt
    socket.on("updateGanttToBack", (nameService, gantt) => {
      Gantt.updateGantt(nameService, gantt);
      gantt = new Gantt({ ...gantt }).toObject();
      gantt = mongoToCentral(gantt);
      client.emit("sendUpdate", gantt);
      io.emit("updateGanttToFront", gantt);
      console.log("UPDATE");
    });
  });
};
// ---------------------------------------------------

// Map entre données de mongo sur le serveur central -------------------
function mongoToCentral(gantt) {
  const central = {
    nameService: gantt.nameService,
    projects: []
  };

  gantt.projects.forEach((project, index) => {
    central.projects[index] = {
      name: project.name,
      desc: project.desc,
      daysOff: {
        Mo: project.daysOff.Mo,
        Tu: project.daysOff.Tu,
        We: project.daysOff.We,
        Th: project.daysOff.Th,
        Fr: project.daysOff.Fr,
        Sa: project.daysOff.Sa,
        Su: project.daysOff.Su
      },
      workingHours: {
        start: project.workingHours.start,
        end: project.workingHours.end
      },
      task: [],
      groupTask: [],
      resources: [],
      milestones: []
    };
    gantt.projects[index].task.forEach((task, index2) => {
      central.projects[index].task[index2] = {
        id: task.id,
        name: task.name,
        desc: task.desc,
        start: task.start,
        end: task.end,
        percentageProgress: task.percentageProgress,
        color: task.color,
        linkedTask: [],
        ressources: []
      };
      if (task.linkedTask[0])
        central.projects[index].task[index2].linkedTask[0] = task.linkedTask[0];
    });
  });

  return central;
}
//-----------------------------------------------
