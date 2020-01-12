"use strict";

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/gantt", { useNewUrlParser: true });

//-----------Connexion à la base avec Mongoose-----------//
let db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {});
//------------------------------------------------------//
const Schema = mongoose.Schema;

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

//-----------Modèle de notre objet Gantt------------//
const Gantt = mongoose.model("gantt", ganttSchema);

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
      if (err) {
        console.log(err);
      }
      return await docs.toObject();
    }
  );
};
//--------------------------------------------------------

// Update des tâches ------------------------------------
ganttSchema.statics.updateGantt = async function(
  nameService = "AcquartGraça",
  gantt
) {
  console.log("TOupdate");
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

// Export du schéma
module.exports = { Gantt };
//---------------------
