const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const path = require("path");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// =====================
// SERVE HTML FILES
// =====================
app.use(express.static(path.join(__dirname, "public")));

// =====================
// DATABASE CONNECTION
// =====================
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Keerthi_2006",
    database: "bus_tracking"
});

db.connect((err) => {
    if (err) {
        console.log("❌ Database Connection Failed");
        console.log(err);
    } else {
        console.log("✅ Database Connected");
    }
});

// =====================
// IMPORT ROUTES
// =====================
const busRoutes = require("./routes/buses");
const attendanceRoutes = require("./routes/attendance");
const trackingRoutes = require("./routes/tracking");
const sosRoutes = require("./routes/sos");

// =====================
// USE ROUTES
// =====================
app.use("/api/buses", busRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/tracking", trackingRoutes);
app.use("/api/sos", sosRoutes);

// =====================
// SEARCH DRIVER
// =====================
app.get("/api/driver/search", (req, res) => {

    const { bus_number, route_name } = req.query;

    let sql = "SELECT * FROM drivers WHERE 1=1";
    let values = [];

    if (bus_number) {
        sql += " AND bus_number = ?";
        values.push(bus_number);
    }

    if (route_name) {
        sql += " AND route_name = ?";
        values.push(route_name);
    }

    db.query(sql, values, (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Server Error",
                error: err
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: "No Driver Found"
            });
        }

        res.json(result);
    });
});

// =====================
// DRIVER REGISTER API
// =====================
app.post("/api/register-driver", (req, res) => {

    const {
        driver_name,
        driver_id,
        bus_number,
        route_name,
        phone,
        password
    } = req.body;

    // ROUTE BASED QR URL
    const qr_url =
        `http://localhost:8000/route-details.html?route=${encodeURIComponent(route_name)}`;

    const sql = `
        INSERT INTO drivers
        (
            driver_name,
            driver_id,
            bus_number,
            route_name,
            phone,
            password,
            qr_url
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            driver_name,
            driver_id,
            bus_number,
            route_name,
            phone,
            password,
            qr_url
        ],
        (err, result) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    message: "Registration Failed"
                });
            }

            res.json({
                message: "Driver Registered Successfully",
                qr_url: qr_url
            });
        }
    );
});

// =====================
// GET DRIVER BY ID
// =====================
app.get("/api/driver/:id", (req, res) => {

    const driverId = req.params.id;

    const sql =
        "SELECT * FROM drivers WHERE driver_id = ?";

    db.query(sql, [driverId], (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Server Error",
                error: err
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: "Driver Not Found"
            });
        }

        res.json(result[0]);
    });
});

// =====================
// ROUTE DETAILS API
// Parent scans QR
// =====================
app.get("/api/route/:routeName", (req, res) => {

    const routeName = req.params.routeName;

    const sql = `
        SELECT
            driver_name,
            driver_id,
            bus_number,
            route_name,
            phone
        FROM drivers
        WHERE route_name = ?
    `;

    db.query(sql, [routeName], (err, result) => {

        if (err) {

            return res.status(500).json({
                message: "Server Error",
                error: err
            });

        }

        if (result.length === 0) {

            return res.status(404).json({
                message: "Route Not Found"
            });

        }

        res.json(result[0]);

    });

});

// =====================
// HEALTH CHECK
// =====================
app.get("/", (req, res) => {

    res.json({
        message: "Bus Tracking API Running"
    });

});

// =====================
// START SERVER
// =====================
app.listen(8000, () => {
    console.log("🚀 Server running on port 8000");
});