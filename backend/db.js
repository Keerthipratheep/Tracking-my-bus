const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Keerthi_2006", 
  database: "bus_tracking"
});

db.connect((err) => {

  if (err) {
    console.log(err);
    console.log("Database Connection Failed");
  }

  else {
    console.log("MySQL Connected");
  }

});

module.exports = db;