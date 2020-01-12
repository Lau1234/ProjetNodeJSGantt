const socket = io();

// Réglages dhtmlxGantt --------------------
gantt.config.xml_date = "%Y-%m-%d";
gantt.config.drag_links = false;
// --------------------------------------

let centralData = [];
let apiGantt;

generateMenu();

socket.emit("getGanttFromFront");
socket.on("getGantt", async (dataReceived, err) => {
  if (err) console.log("getGantt error:", err);
  console.log("dataReceived:", dataReceived);
  apiGantt = dataReceived;
});

// Initialisation de la connexion --------------------
socket.on("connection", data => {
  console.log("data:", data);
  centralData = data;
  generateMenu();
});
// --------------------------------------

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
  li = document.createElement("li");
  ul.appendChild(li);
  li.innerHTML = "AcquartGraça";
  li.setAttribute("onclick", `loadGantt(\"AcquartGraça\")`);
  centralData.forEach(service => {
    li = document.createElement("li");
    ul.appendChild(li);
    li.innerHTML = service.nameService;
    li.setAttribute("onclick", `loadGantt(${service.nameService})`);
  });
}

// Charge le gantt entré en paramètre

function loadGantt(ganttService) {
  document.getElementById("gantt").innerHTML =
    '<div id="gantt_here" style="width:100%; height:100%;"></div>';

  gantt.init("gantt_here");

  let ganttToLoad;

  if (ganttService === "AcquartGraça") {
    gantt.config.readonly = false;
    ganttToLoad = apiGantt;
  } else {
    gantt.config.readonly = true;
    ganttToLoad = centralData.find(data => data.nameService === ganttService);
  }

  console.log("ganttToLoad:", ganttToLoad);

  gantt.parse(backToFront(ganttToLoad));
}

//    Convertion des données venant du Back pour envoyer au Front

function backToFront(backGantt) {
  const frontGantt = { gantt: { data: [] } };

  backGantt.projects[0].task.forEach((task, index) => {
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
  socket.on("updateGanttToFront", data => {
    console.log(data);
  });
}
//-----------------------------------------------------------------------
