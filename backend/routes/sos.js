const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/alert", (req, res) => {
  const { student_name, bus_number, emergency_type } = req.body;

  const sql =
    "INSERT INTO sos_alerts (student_name, bus_number, emergency_type) VALUES (?, ?, ?)";

  db.query(
    sql,
    [student_name, bus_number, emergency_type],
    (err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send("SOS Alert Sent");
      }
    }
  );
});

module.exports = router;
