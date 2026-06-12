const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", (req, res) => {
  db.query("SELECT * FROM buses", (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(result);
    }
  });
});

router.post("/add", (req, res) => {
  const { bus_number, driver_name, route_name, latitude, longitude, speed } =
    req.body;

  const sql =
    "INSERT INTO buses (bus_number, driver_name, route_name, latitude, longitude, speed) VALUES (?, ?, ?, ?, ?, ?)";

  db.query(
    sql,
    [bus_number, driver_name, route_name, latitude, longitude, speed],
    (err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send("Bus Added Successfully");
      }
    }
  );
});

module.exports = router;
