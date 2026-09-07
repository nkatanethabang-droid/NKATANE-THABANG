

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


// MySQL Connection

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "student_attendance"
});


// Connect to MySQL

db.connect((error) => {

    if (error) {
        console.log("Database connection failed");
        console.log(error);
        return;
    }

    console.log("Connected to MySQL Database");

});


// ==========================
// GET ALL STUDENTS
// ==========================

app.get("/api/students", (req, res) => {

    const sql = "SELECT * FROM students";

    db.query(sql, (error, results) => {

        if (error) {
            return res.status(500).json({
                error: error.message
            });
        }

        res.json(results);

    });

});


// ==========================
// ADD STUDENT
// ==========================

app.post("/api/students", (req, res) => {

    const {
        studentNumber,
        name,
        status
    } = req.body;


    const sql = `
        INSERT INTO students
        (studentNumber, name, status)
        VALUES (?, ?, ?)
    `;


    db.query(

        sql,

        [
            studentNumber,
            name,
            status
        ],

        (error, result) => {

            if (error) {

                return res.status(500).json({
                    error: error.message
                });

            }


            res.json({
                message: "Student added successfully"
            });

        }

    );

});


// ==========================
// UPDATE STUDENT
// ==========================

app.put("/api/students/:studentNumber", (req, res) => {

    const studentNumber =
        req.params.studentNumber;


    const {
        name,
        status
    } = req.body;


    const sql = `
        UPDATE students
        SET name = ?,
            status = ?
        WHERE studentNumber = ?
    `;


    db.query(

        sql,

        [
            name,
            status,
            studentNumber
        ],

        (error, result) => {

            if (error) {

                return res.status(500).json({
                    error: error.message
                });

            }


            res.json({
                message: "Student updated successfully"
            });

        }

    );

});


// ==========================
// DELETE STUDENT
// ==========================

app.delete(
    "/api/students/:studentNumber",

    (req, res) => {

        const studentNumber =
            req.params.studentNumber;


        const sql = `
            DELETE FROM students
            WHERE studentNumber = ?
        `;


        db.query(

            sql,

            [studentNumber],

            (error, result) => {

                if (error) {

                    return res.status(500).json({
                        error: error.message
                    });

                }


                res.json({
                    message:
                        "Student deleted successfully"
                });

            }

        );

    }

);


// ==========================
// START SERVER
// ==========================

app.listen(5000, () => {

    console.log(
        "Server running on port 5000"
    );

});