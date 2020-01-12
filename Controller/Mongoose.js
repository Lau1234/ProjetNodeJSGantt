"use strict";

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/gantt", { useNewUrlParser: true });

//-----------Connexion à la base avec Mongoose-----------//
let db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {});
//------------------------------------------------------//
const Schema = mongoose.Schema;
const emptyProject = {
  nameService: "AcquartGraça",
  projects: [
    {
      name: "New Project",
      desc: "This is a new project",
      daysOff: {
        Mo: false,
        Tu: false,
        We: false,
        Th: false,
        Fr: false,
        Sa: true,
        Su: true
      },
      workingHours: { start: 0, end: 0 },
      task: [],
      groupTask: [],
      resources: [],
      milestones: []
    }
  ]
};
//-----------Schema de notre objet Gantt------------//
const ganttSchema = new Schema({
  nameService: String,
  projects: [
    {
      name: { type: String, required: true },
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
      task: {
        type: [
          {
            id: { type: Number, required: true },
            name: { type: String, required: true }, //
            desc: String,
            start: { type: Number, required: true },
            end: { type: Number, required: true },
            percentageProgress: Number,
            color: String,
            linkedTask: [Number],
            ressources: [{ name: String, cost: Number, type: { type: String } }] //
          }
        ],
        required: true
      },
      groupTask: [{ name: String, start: Number, end: Number }],
      resources: [{ name: String, cost: Number, type: { type: String } }],
      milestones: [{ name: String, date: Number }]
    }
  ]
});
//------------------------------------------------//

// Création d'un projet ---------------------------
ganttSchema.statics.createGantt = async gantt => {
  const newGantt = new Gantt({ ...gantt });
  return newGantt.save(err => {
    if (err) console.error(err);
  });
};
//-------------------------------------------------

// Récupération du gantt dans la base de données -----------
ganttSchema.statics.getGantt = async function(nameService = "AcquartGraça") {
  console.log("nameService:", nameService);
  return await Gantt.findOne(
    { nameService: nameService },
    async (err, docs) => {
      if (err) console.log(err);
      if (docs === null) {
        const newGantt = new Gantt({ ...emptyProject });
        await newGantt.save(err => {
          if (err) console.log("ERROR 2 :", err);
          console.log("create empty project");
        });
        return await Gantt.findOne({ nameService: nameService }, async function(
          err,
          newdocs
        ) {
          if (err) console.log(err);
          console.log("new docs : ", newdocs);
          return await newdocs.toObject();
        });
      } else return await docs.toObject();
    }
  );
};
//--------------------------------------------------------

// Update des tâches ------------------------------------
ganttSchema.statics.updateGantt = async function(
  nameService = "AcquartGraça",
  gantt
) {
  return await Gantt.updateOne(
    { nameService: nameService },
    { ...gantt },
    async err => {
      if (err) {
        console.log(err);
      }
    }
  );
};
//-----------------------------------------------------

//-----------Modèle de notre objet Gantt------------//
const Gantt = mongoose.model("gantt", ganttSchema);

// Export du schéma
module.exports = { Gantt };
//---------------------
