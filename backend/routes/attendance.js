const express = require("express");
const router = express.Router();
const db = require("../db");
router.post("/mark", (req, res) => {
  const { student_name, bus_number } = req.body;
  const sql =
    "INSERT INTO attendance (student_name, bus_number) VALUES (?, ?)";
  db.query(sql, [student_name, bus_number], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send("Attendance Marked");
    }
  });
});
router.get("/", (req, res) => {
  db.query("SELECT * FROM attendance", (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(result);
    }
  });
});
module.exports = router;