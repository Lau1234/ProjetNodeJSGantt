const url = "http://localhost:3000/gantt/";
const socket = io();

// Réglages dhtmlxGantt --------------------
gantt.config.xml_date = "%Y-%m-%d";
gantt.config.drag_links = false;
// --------------------------------------

let centralData = [];
let apiGantt;

// Initialisation de la connexion --------------------
socket.on("connection", data => {
  console.log("data:", data);
  centralData = data;
  generateMenu();
});
// --------------------------------------

// Affichage gantt --------------------

gantt.init("gantt_here");

socket.emit("getGanttFromFront");
socket.on("getGantt", (dataReceived, err) => {
  if (err) console.log("getGantt error:", err);
  apiGantt = dataReceived;
  gantt.parse(backToFront());
});
// ------------------------------------

// Event Modification/Supression/Creation
gantt.attachEvent("onAfterTaskAdd", () => {
  updateGantt();
});
gantt.attachEvent("onAfterTaskUpdate", () => {
  updateGantt();
});
gantt.attachEvent("onAfterTaskDelete", () => {
  updateGantt();
});
//--------------------------------------

// Fonctions------------------------------------------------------------

// Génere le menu en fonction des Gantt récupérés du central

function generateMenu() {
  let ul = document.getElementById("gantt_list");
  ul.innerHTML = "";
  centralData.forEach(service => {
    li = document.createElement("li");
    ul.appendChild(li);
    li.innerHTML = service.nameService;
  });
}

//    Convertion des données venant du Back pour envoyer au Front

function backToFront() {
  const frontGantt = { gantt: { data: [] } };

  apiGantt.projects[0].task.forEach((task, index) => {
    frontGantt.gantt.data.push({
      id: task.id,
      text: task.name,
      start_date: moment.unix(task.start).format("YYYY-MM-DD"),
      end_date: moment.unix(task.end).format("YYYY-MM-DD"),
      duration: Math.floor((task.end - task.start) / 60 / 60 / 24),
      parent: task.linkedTask[0],
      progress: task.percentageProgress / 100
    });
    if (task.color) {
      frontGantt.gantt.data[index].color = task.color;
    }
  });
  return frontGantt.gantt;
}

//      Convertion des données venant du Front pour envoyer au Back
function frontToBack(frontGantt) {
  apiGantt.projects[0].task = [];
  frontGantt.data.forEach(taskFront => {
    apiGantt.projects[0].task.push({
      id: taskFront.id,
      name: taskFront.text,
      desc: taskFront.text,
      start: parseInt(moment(taskFront.start_date).format("X")),
      end: parseInt(moment(taskFront.end_date).format("X")),
      percentageProgress: taskFront.progress * 100,
      color: taskFront.color,
      linkedTask: parseInt([taskFront.parent]),
      ressources: []
    });
  });
}

//    Update et envoie des nouvelles taches au Back
function updateGantt() {
  frontToBack(gantt.serialize());
  socket.emit("updateGanttToBack", apiGantt.nameService, apiGantt);
  console.log("UpdateTask");
  socket.on("updateGanttToFront", data => {
    console.log(data);
  });
}
//-----------------------------------------------------------------------
