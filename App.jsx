import { useEffect, useState } from "react";
import "./App.css";

function App() {
    const [students, setStudents] = useState([]);

    const [studentNumber, setStudentNumber] = useState("");
    const [name, setName] = useState("");
    const [status, setStatus] = useState("Present");

    const [editingStudentNumber, setEditingStudentNumber] = useState(null);

    const [message, setMessage] = useState("");

    // Retrieve students
    const getStudents = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/students"
            );

            const data = await response.json();

            setStudents(data);

        } catch (error) {
            console.error(error);

            setMessage("Unable to connect to server.");
        }
    };

    // Load students when page opens
    useEffect(() => {
        getStudents();
    }, []);

    // Add or update student attendance
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (
            studentNumber.trim() === "" ||
            name.trim() === ""
        ) {
            setMessage(
                "Please enter the student number and student name."
            );

            return;
        }

        if (
            status !== "Present" &&
            status !== "Absent"
        ) {
            setMessage(
                "Status must be Present or Absent."
            );

            return;
        }

        try {
            let response;

            // INSERT
            if (editingStudentNumber === null) {
                response = await fetch(
                    "http://localhost:5000/api/students",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            studentNumber: studentNumber.trim(),
                            name: name.trim(),
                            status: status
                        })
                    }
                );
            }

            // UPDATE
            else {
                response = await fetch(
                    `http://localhost:5000/api/students/${encodeURIComponent(
                        editingStudentNumber
                    )}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            studentNumber: studentNumber.trim(),
                            name: name.trim(),
                            status: status
                        })
                    }
                );
            }

            const data = await response.json();

            if (!response.ok) {
                setMessage(
                    data.error || "Something went wrong."
                );

                return;
            }

            if (editingStudentNumber === null) {
                setMessage(
                    "Student attendance added successfully."
                );
            } else {
                setMessage(
                    "Student attendance updated successfully."
                );
            }

            setStudentNumber("");
            setName("");
            setStatus("Present");
            setEditingStudentNumber(null);

            getStudents();

        } catch (error) {
            console.error(error);

            setMessage(
                "Unable to connect to server."
            );
        }
    };

    // Edit student
    const handleEdit = (student) => {
        setStudentNumber(student.studentNumber);
        setName(student.name);
        setStatus(student.status);

        setEditingStudentNumber(student.studentNumber);

        setMessage("Editing student attendance...");
    };

    // Cancel editing
    const handleCancel = () => {
        setStudentNumber("");
        setName("");
        setStatus("Present");

        setEditingStudentNumber(null);

        setMessage("");
    };

    // Delete student
    const handleDelete = async (studentNumber) => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/students/${encodeURIComponent(
                    studentNumber
                )}`,
                {
                    method: "DELETE"
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(
                    data.error || "Unable to delete student."
                );

                return;
            }

            setMessage(
                "Student attendance deleted successfully."
            );

            getStudents();

        } catch (error) {
            console.error(error);

            setMessage(
                "Unable to connect to server."
            );
        }
    };

    return (
        <div className="app">

            <div className="container">

                <h1>
                    Student Attendance
                </h1>

                <p className="subtitle">
                    Manage student attendance
                </p>

                <form onSubmit={handleSubmit}>

                    {/* Student Number */}
                    <div className="form-group">

                        <label>
                            Student Number
                        </label>

                        <input
                            type="text"
                            placeholder="Enter student number"
                            value={studentNumber}
                            onChange={(event) =>
                                setStudentNumber(event.target.value)
                            }
                        />

                    </div>

                    {/* Student Name */}
                    <div className="form-group">

                        <label>
                            Student Name
                        </label>

                        <input
                            type="text"
                            placeholder="Enter student name"
                            value={name}
                            onChange={(event) =>
                                setName(event.target.value)
                            }
                        />

                    </div>

                    {/* Attendance Status */}
                    <div className="form-group">

                        <label>
                            Attendance Status
                        </label>

                        <select
                            value={status}
                            onChange={(event) =>
                                setStatus(event.target.value)
                            }
                        >
                            <option value="Present">
                                Present
                            </option>

                            <option value="Absent">
                                Absent
                            </option>
                        </select>

                    </div>

                    {/* Buttons */}
                    <div className="buttons">

                        <button type="submit">

                            {editingStudentNumber === null
                                ? "Add Student"
                                : "Update Student"}

                        </button>

                        {editingStudentNumber !== null && (

                            <button
                                type="button"
                                className="cancel-button"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>

                        )}

                    </div>

                </form>

                {/* Message */}
                {message && (
                    <p className="message">
                        {message}
                    </p>
                )}

                <h2>
                    Student Attendance Records
                </h2>

                <table>

                    <thead>

                        <tr>

                            <th>
                                Student Number
                            </th>

                            <th>
                                Student Name
                            </th>

                            <th>
                                Status
                            </th>

                            <th>
                                Actions
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {students.map((student) => (

                            <tr
                                key={student.studentNumber}
                            >

                                <td>
                                    {student.studentNumber}
                                </td>

                                <td>
                                    {student.name}
                                </td>

                                <td
                                    className={
                                        student.status === "Present"
                                            ? "present"
                                            : "absent"
                                    }
                                >
                                    {student.status}
                                </td>

                                <td>

                                    <button
                                        className="edit-button"
                                        onClick={() =>
                                            handleEdit(student)
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="delete-button"
                                        onClick={() =>
                                            handleDelete(
                                                student.studentNumber
                                            )
                                        }
                                    >
                                        Delete
                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default App;