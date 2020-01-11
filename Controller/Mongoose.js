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

ganttSchema.statics.createGantt = async gantt => {
  const newGantt = new Gantt({ ...gantt });
  return newGantt.save(err => {
    if (err) console.error(err);
  });
};

ganttSchema.statics.getGantt = async function(nameService = "AcquartGraça") {
  return await this.find({ nameService: nameService });
};

ganttSchema.statics.updateGantt = async (
  nameService = "AcquartGraça",
  gantt
) => {
  return await Gantt.update({ nameService: nameService }, { ...gantt }, err => {
    if (err) console.error(err);
  });
};

const Gantt = mongoose.model("gantt", ganttSchema);

module.exports = { Gantt };
