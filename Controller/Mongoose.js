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
            linkedTask: Array,
            ressources: Array //
          }
        ],
        required: true
      },
      groupTask: [{ name: String, start: Number, end: Number }],
      resources: [{ name: String, cost: Number, type: String }],
      milestones: [{ name: String, date: Number }]
    }
  ]
});
//------------------------------------------------//

ganttSchema.statics.addProject = async function(gantt) {
  const newGantt = new Gantt({ ...gantt });
  console.log("new Gantt:", newGantt);
  return await Gantt.save(newGantt);
};

ganttSchema.statics.listGantt = async function() {
  return await this.find();
};

ganttSchema.statics.updateproject = async function(gantt) {
  const Gantt = new this(gantt);
  return await Gantt.remove(gantt);
};

const Gantt = mongoose.model("gantt", ganttSchema);

module.exports = { Gantt };
