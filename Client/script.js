const url = "http://localhost:3000/gantt/";
const socket = io();

// Affichage gantt --------------------

gantt.config.xml_date = "%Y-%m-%d %H:%i";

gantt.init("gantt_here");
socket.on("getGantt", data => {
  // gantt.parse
  console.log(data);
})
gantt.parse({
  data: [
    {
      id: 1,
      resource_id: "3",
      text: "Project #1",
      start_date: null,
      duration: null,
      parent: 0,
      progress: 0,
      color: "#000000",
      open: true
    },
    {
      id: 2,
      text: "Task #1",
      start_date: "2019-08-01 00:00",
      duration: 5,
      parent: 1,
      progress: 1
    },
    {
      id: 3,
      text: "Task #2",
      start_date: "2019-08-06 00:00",
      duration: 2,
      parent: 1,
      progress: 0.5
    },
    {
      id: 4,
      text: "Task #3",
      start_date: null,
      duration: null,
      parent: 1,
      progress: 0.8,
      open: true
    },
    {
      id: 5,
      text: "Task #3.1",
      start_date: "2019-08-09 00:00",
      duration: 2,
      parent: 4,
      progress: 0.2
    },
    {
      id: 6,
      text: "Task #3.2",
      start_date: "2019-08-11 00:00",
      duration: 1,
      parent: 4,
      progress: 0
    }
  ],
  links: [
    { id: 1, source: 2, target: 3, type: "0" },
    { id: 2, source: 3, target: 4, type: "0" },
    { id: 3, source: 5, target: 6, type: "0" }
  ]
});

//--------------------------------------

gantt.attachEvent("onLightboxSave", function(id, task, is_new){
  //any custom logic here
  var idTask = gantt.getTask(id);
  console.log(idTask);
//var task =  gantt.getTask(gantt.getSelectedId());
  console.log("test onLihtBoxSave " + task)
  return true;
})
//Sauvegarde Gantt ---------------------
function createGantt() {
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
        workingHours: {
          start: 0 /*moment().hour()*/,
          end: 0 /*moment().hour()*/
        },
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
  socket.emit("createGantt", gantt)
console.log("Fonction createGantt + " + gantt);
  // const options = {
  //   ...defaultOptions,
  //   method: "POST",
  //   body: JSON.stringify(fakeGantt)
  // };

  // fetch(url + "new", options)
  //   .then(response => response.json())
  //   .then(response => {
  //     console.log(response);
  //   });
}
//--------------------------------------
// gantt.load("/data");
// var dp = new gantt.dataProcessor("/data");
// dp.init(gantt);
// dp.setTransactionMode("REST");

createGantt();
getGantt();

// function getGantt() {
//   const options = { ...defaultOptions, method: "GET" };

//   fetch(url, options)
//     .then(response => response.json())
//     .then(response => {
//       console.log(response);
//     });
// }

