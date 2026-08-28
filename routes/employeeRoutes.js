const express = require("express");

const {
    getEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee
} = require("../controllers/employeeController");

const apiKeyMiddleware = require("../middleware/apiKeyMiddleware");

const router = express.Router();

router.get("/employees", apiKeyMiddleware, getEmployees);

router.post("/employees", apiKeyMiddleware, createEmployee);

router.put("/employees/:id", updateEmployee);

router.delete("/employees/:id", deleteEmployee);

module.exports = router;