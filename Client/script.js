const socket = io();

// Réglages dhtmlxGantt --------------------
gantt.config.xml_date = "%Y-%m-%d";
gantt.config.drag_links = false;
// --------------------------------------

let centralData = [];
let apiGantt;

// Configuration dhtmlxGantt -------------------------
let optsColor = [
  { key: "#ff0000", label: "Rouge" },
  { key: "#0000ff", label: "Bleu" },
  { key: "#00ff00", label: "Vert" },
  { key: "#ff9900", label: "Jaune" }
];
let optsResources = [
  { key: "Antoine", label: "Antoine" },
  { key: "Laura", label: "Laura" }
];
//Config lightBox
gantt.config.lightbox.sections = [
  { name: "name", height: 38, map_to: "name", type: "textarea", focus: true },
  { name: "description", height: 38, map_to: "text", type: "textarea" },
  { name: "time", height: 38, map_to: "auto", type: "duration" },
  {
    name: "color",
    height: 50,
    map_to: "color",
    type: "select",
    options: optsColor
  },
  {
    name: "ressources",
    height: 50,
    map_to: "ressources",
    type: "checkbox",
    options: optsResources
  }
];
//Config label lightBox
gantt.locale.labels.section_name = "Name";
gantt.locale.labels.section_color = "Picker Color";
gantt.locale.labels.section_ressources = "Assigned to";

//Config column gantt
gantt.config.columns = [
  { name: "name", label: "Task name", width: "*", tree: true },
  { name: "start_date", label: "Start time", align: "center" },
  { name: "duration", label: "Duration", align: "center" },
  { name: "add", label: "", width: 44 }
];
//Config label task
gantt.templates.task_text = function(start, end, task) {
  return task.name;
};

//-----------------------------------------------------

//Génération du menu ---------------------------
generateMenu();

socket.emit("getGanttFromFront");
socket.on("getGantt", async (dataReceived, err) => {
  if (err) console.log("getGantt error:", err);
  apiGantt = dataReceived;
});

// Initialisation de la connexion --------------------
socket.on("connection", data => {
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
  let select = document.getElementById("gantt_list");
  select.innerHTML = "";
  select.setAttribute("onchange", `loadGantt()`);
  let option = document.createElement("option");
  select.appendChild(option);
  option.innerHTML = "Choisir un service";
  option.setAttribute("value", "");
  option = document.createElement("option");
  select.appendChild(option);
  option.innerHTML = "AcquartGraça";
  option.setAttribute("id", "our_project");
  centralData.forEach(service => {
    if (service.nameService !== "AcquartGraça") {
      option = document.createElement("option");
      select.appendChild(option);
      option.innerHTML = service.nameService;
      option.setAttribute("value", `${service.nameService}`);
    }
  });
}

// Charge le gantt selectionné

function loadGantt() {
  const ganttService = document.getElementById("gantt_list").value;
  if (ganttService) {
    document.getElementById("gantt").innerHTML =
      '<div id="gantt_here" style="width:100%; height:100%;"></div>';

    gantt.init("gantt_here");

    let ganttToLoad;

    let edit = document.getElementById("edit_project");
    edit.innerHTML = "";

    if (ganttService === "AcquartGraça") {
      gantt.config.readonly = false;
      ganttToLoad = apiGantt;

      let edit = document.getElementById("edit_project");
      edit.innerHTML += `
      <form>
      <div>
          <span class="name">Name :</span>
          <input type="text" id="name" placeholder="project name" value="${
            ganttToLoad.projects[0].name
          }" />
        </div>
        <div>
          <span class="description">Description :</span>
          <input type="text" id="desc" placeholder="project description" value="${
            ganttToLoad.projects[0].desc
          }" />
          </div>
          <div class="daysoff">
            <span>Days off :</span>
            <div>
              <input type="checkbox" id="Mo" name="Mo" ${
                ganttToLoad.projects[0].daysOff.Mo ? "checked" : ""
              }>
              <label for="coding">Mo</label>
            </div>
            <div>
              <input type="checkbox" id="Tu" name="Tu" ${
                ganttToLoad.projects[0].daysOff.Tu ? "checked" : ""
              }>
              <label for="coding">Tu</label>
            </div>
            <div>
              <input type="checkbox" id="We" name="We" ${
                ganttToLoad.projects[0].daysOff.We ? "checked" : ""
              }>
              <label for="coding">We</label>
            </div>
            <div>
              <input type="checkbox" id="Th" name="Th" ${
                ganttToLoad.projects[0].daysOff.Th ? "checked" : ""
              }>
              <label for="coding">Th</label>
            </div>
            <div>
              <input type="checkbox" id="Fr" name="Fr" ${
                ganttToLoad.projects[0].daysOff.Fr ? "checked" : ""
              }>
              <label for="coding">Fr</label>
            </div>
            <div>
              <input type="checkbox" id="Sa" name="Sa" ${
                ganttToLoad.projects[0].daysOff.Sa ? "checked" : ""
              }>
              <label for="coding">Sa</label>
            </div>
            <div>
              <input type="checkbox" id="Su" name="Su" ${
                ganttToLoad.projects[0].daysOff.Su ? "checked" : ""
              }>
              <label for="coding">Su</label>
            </div>
          </div>
          <input
            type="button"
            id="save_button"
            value="save"
            onclick="editProject()"
          />
      </form>
      `;
    } else {
      gantt.config.readonly = true;
      ganttToLoad = centralData.find(data => data.nameService === ganttService);
    }

    gantt.clearAll();
    gantt.parse(backToFront(ganttToLoad));
  }
}

//    Convertion des données venant du Back pour envoyer au Front

function backToFront(backGantt) {
  const frontGantt = { gantt: { data: [] } };
  if (backGantt.projects.length > 0) {
    backGantt.projects[0].task.forEach((task, index) => {
      task.id = task.id + 1;
      frontGantt.gantt.data.push({
        id: task.id,
        name: task.name,
        text: task.desc,
        start_date: moment.unix(task.start).format("YYYY-MM-DD"),
        end_date: moment.unix(task.end).format("YYYY-MM-DD"),
        duration: Math.floor((task.end - task.start) / 60 / 60 / 24),
        parent: task.linkedTask[0] !== 0 ? task.linkedTask[0] + 1 : 0,
        progress: task.percentageProgress / 100
      });
      if (task.linkedTask[0] !== 0) {
        task.linkedTask[0] = task.linkedTask[0] + 1;
        let parentIndex = frontGantt.gantt.data.findIndex(
          value => value.id === task.linkedTask[0]
        );
        if (parentIndex !== -1) {
          frontGantt.gantt.data[parentIndex].open = true;
        }
      }
      if (task.color) {
        frontGantt.gantt.data[index].color = task.color;
      }
      // task.ressources.forEach(ressource => {
      //   frontGantt.gantt.data[index].ressources.push({
      //     name: ressource.name,
      //     cost: ressource.cost,
      //     type: ressource.type
      //   });
      // });
    });
  }
  return frontGantt.gantt;
}

//      Convertion des données venant du Front pour envoyer au Back
function frontToBack(frontGantt) {
  apiGantt.projects[0].task = [];
  frontGantt.data.forEach((taskFront, index) => {
    apiGantt.projects[0].task.push({
      id: taskFront.id,
      name: taskFront.name,
      desc: taskFront.text,
      start: parseInt(moment(taskFront.start_date).format("X")),
      end: parseInt(moment(taskFront.end_date).format("X")),
      percentageProgress: taskFront.progress * 100,
      color: taskFront.color,
      linkedTask: [parseInt(taskFront.parent)],
      ressources: []
    });
    // taskFront.ressources.forEach(ressource => {
    //   apiGantt.projects[0].task[index].ressources.push({
    //     name: ressource.name,
    //     cost: ressource.cost,
    //     type: ressource.type
    //   });
    // });
  });
}

function editProject() {
  apiGantt.projects[0].name = document.getElementById("name").value;
  apiGantt.projects[0].desc = document.getElementById("desc").value;
  apiGantt.projects[0].daysOff = {
    Mo: document.getElementById("Mo").checked,
    Tu: document.getElementById("Tu").checked,
    We: document.getElementById("We").checked,
    Th: document.getElementById("Th").checked,
    Fr: document.getElementById("Fr").checked,
    Sa: document.getElementById("Sa").checked,
    Su: document.getElementById("Su").checked
  };
  updateGantt();
}

//    Update et envoie des nouvelles taches au Back
function updateGantt() {
  frontToBack(gantt.serialize());
  socket.emit("updateGanttToBack", apiGantt.nameService, apiGantt);
  // socket.on("updateGanttToFront", data => {
  //   console.log("DATA UPDATED : ", data);
  // });
}
//-----------------------------------------------------------------------
