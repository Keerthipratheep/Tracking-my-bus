
const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/live", (req, res) => {
  db.query("SELECT * FROM buses", (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(result);
    }
  });
});

module.exports = router;
