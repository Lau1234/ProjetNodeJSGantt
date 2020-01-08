"use strict";

const express = require("express");
const router = express.Router();

const { Gantt } = require("./Mongoose");

// GET gantt
router.get("", (req, res) => {
  let gantt = Gantt.listGantt();

  res.json({ response: gantt });
});

// CREATE gantt
router.post("/new", (req, res) => {
  let gantt = Gantt.addProject(req.body);

  res.status(201).json({ response: gantt });
});

module.exports.router = router;
