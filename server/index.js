const express = require("express");
// Express.js is a fast, unopinionated, minimalist web framework for Node.js, designed to build web applications and APIs.It provides a robust set of features to develop web and mobile applications, including handling HTTP requests, serving static files, creating routes, and managing middleware

const mongoose = require("mongoose");
// Mongoose is a popular Object Data Modeling(ODM) library for MongoDB and Node.js.It provides a straightforward way to interact with MongoDB through schemas, models, and powerful query methods, abstracting away much of the complexity of working with raw MongoDB queries.

const cors = require("cors");
// In a typical web browser, JavaScript running on one domain(for example, http://localhost:3000) is restricted from making HTTP requests (such as GET, POST, etc.) to another domain (like http://localhost:3001). This restriction is enforced by the Same-Origin Policy, which aims to prevent malicious websites from accessing data on other websites without permission.

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/employee")
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log("MongoDB connection error:", err));

// Employee Model (Mongoose Schema)
//Schema is a blueprint or structure for the documents within a MongoDB collection.
const employeeSchema = new mongoose.Schema({
    name: String,
    department: String,
    designation: String,
    salary: Number
});
const Employee = mongoose.model("Employee", employeeSchema);

// Route to fetch all employees
app.get("/employees", (req, res) => {
    Employee.find()
        .then(employees => res.json(employees))
        .catch(err => res.status(500).json({ error: "Error fetching employees", details: err }));
});

// Route to fetch a single employee by ID
app.get("/employees/:id", (req, res) => {
    const { id } = req.params;
    Employee.findById(id)
        .then(employee => {
            if (!employee) {
                return res.status(404).json({ message: "Employee not found" });
            }
            res.json(employee);
        })
        .catch(err => res.status(500).json({ error: "Error fetching employee", details: err }));
});

// Create a new employee
app.post("/employees", (req, res) => {
    const newEmployee = new Employee(req.body);
    newEmployee.save()
        .then(employee => res.json(employee))
        .catch(err => res.status(500).json({ error: "Error creating employee", details: err }));
});

// Update employee details
app.put("/employees/:id", (req, res) => {
    const { id } = req.params;
    Employee.findByIdAndUpdate(id, req.body, { new: true })
        .then(updatedEmployee => res.json(updatedEmployee))
        .catch(err => res.status(500).json({ error: "Error updating employee", details: err }));
});

// Delete employee
app.delete("/employees/:id", (req, res) => {
    const { id } = req.params;
    Employee.findByIdAndDelete(id)
        .then(() => res.json({ message: "Employee deleted successfully" }))
        .catch(err => res.status(500).json({ error: "Error deleting employee", details: err }));
});

// Start the server
app.listen(3001, () => {
    console.log("Server running on port 3001");
});
