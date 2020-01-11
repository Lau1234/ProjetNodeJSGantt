const url = "http://localhost:3000/gantt/";
const socket = io();

gantt.config.xml_date = "%Y-%m-%d %H:%i";
gantt.config.drag_links = false;

socket.on("connection", data => {
  console.log("data:", data);
});

class ApiGantt {
  gantt = {
    nameService: String,
    projects: [
      {
        name: String,
        desc: String,
        daysOff: {
          Mo: Boolean,
          Tu: Boolean,
          We: Boolean,
          Th: Boolean,
          Fr: Boolean,
          Sa: Boolean,
          Su: Boolean 
        },
        workingHours: { start: Number, end: Number },
        task: [
            {
              id: Number,
              name: String, //
              desc: String,
              start: Number,
              end: Number,
              percentageProgress: Number,
              color: String,
              linkedTask: [Number],
              ressources: [{ name: String, cost: Number, type: String }] //
            }
          ],
        groupTask: [{ name: String, start: Number, end: Number }],
        resources: [{ name: String, cost: Number, type: String }],
        milestones: [{ name: String, date: Number }]
      }
    ]
  }
}

class FrontGantt {
  gantt = { data: [
    {
      id: Number,
      text: String,
      start_date: String,
      duration: Number,
      parent: Number,
      progress: Number,
      color: String
    }
  ]
}}

// Affichage gantt --------------------

let apiGantt;
gantt.init("gantt_here");

let DataFromBack;
socket.emit('getGanttFromFront');
socket.on("getGantt", (dataReceived, err) => {
  // gantt.parse
  if (err) console.log('getGantt error:', err);
 //backToFront(data);
 apiGantt = dataReceived[0];
 gantt.parse(backToFront(apiGantt));
  console.log("DATAAAAAAA", dataReceived);
});

function backToFront(gantt) {
  const apiGantt = gantt; // new ApiGantt({...gantt});
  const frontGantt = {gantt: { data: []}};
  console.log('apiGantt:', apiGantt);
  console.log('frontGantt:', frontGantt);
  apiGantt.projects.forEach(project => {
    project.task.forEach(task => {
      frontGantt.gantt.data.push({id: task.id, text: task.name, start_date: null /*task.start.toString  error */, duration: null/*task.end.toString  error */, parent: 0/*task.linkedTask[0]*/, progress: task.percentageProgress / 100, color: task.color });})
  });
  console.log('forfzetenneyrrnyrnyeyeztdh.gantt', frontGantt.gantt);
  return frontGantt.gantt;
}

function frontToBack(gantt){
  const frontgantt = new FrontGantt({...gantt});
  const apiGantt = new ApiGantt();
  frontgantt.gantt.data.forEach(taskFront => {
    apiGantt.gantt.projects.forEach(project => {
      project.task = [];
      project.task.push({id : taskFront.id, name: taskFront.text, desc:taskFront, start: Date.parse(taskFront.start_date), end: Date.parse(taskFront.start_date) + Date.parse(taskFront.duration), percentageProgress:taskFront.progress * 100,color:taskFront.color,linkedTask:taskFront.parent, ressources:[]});
    })
  });
}


//--------------------------------------

// gantt.attachEvent("", function(id, item) {
//   console.log("---------------");
//   createGantt();
// });

// gantt.attachEvent("onLightboxSave", () => {

// });
// gantt.attachEvent("onAfterLinkAdd", () => {
//   console.log("onAfterTaskUpdate")
// });
// gantt.attachEvent("onAfterLinkUpdate", () => {
//   console.log("onAfterLinkAdd")
// });

// gantt.attachEvent("onAfterLinkDelete", () => {
  
// });
//Sauvegarde Gantt ---------------------
function createGantt(gantttest) {
  const gantt = {
    nameService: "AcquartGraça",
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
  socket.emit("createGantt", gantt);
  console.log("Fonction createGantt + " + gantt);
}

function updateGantt() {
  const gantt = getGantt();
  socket.emit('updateGantt', (gantt.nameService, gantt));
}
// createGantt();
//getGantt();
