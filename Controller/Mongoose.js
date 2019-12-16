"use strict";

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/gantt", { useNewUrlParser: true });

let db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  // we're connected!
});

const Schema = mongoose.Schema; 
const ganttSchema = new Schema (
  {
  nameService : String, 
  projects : [
 { 
    name : String, 
    desc : String, 
    daysOff : { Mo : Boolean, Tu : Boolean,  We : Boolean, Th : Boolean, Fr : Boolean, Sa : Boolean, Su : Boolean },
    workingHours : { start : Number, end : Number }, 
    task : [{ id : Number, name : String, desc : String, start : Number, end : Number, percentageProgress : Number, color  : String, linkedTask : Array, ressources : Array }], 
    groupTask : [{ name : String, start : Number, end : Number }], 
    resources : [{ name : String, cost : Number, type : String }], 
    milestones : [{ name : String, date : Number }] 
   } 
  ] 
 }
 );

 module.exports = mongoose.model('gantt', ganttSchema);