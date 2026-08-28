const sql = require("../db");


// GET ALL EMPLOYEES
const getEmployees = async (req, res) => {

    try {
        const result = await sql.query("SELECT * FROM dbo.Employees");

        res.json(result.recordset);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Database error"
        });
    }
};


// CREATE EMPLOYEE
const createEmployee = async (req, res) => {

    try {

        const { name, email, position, salary } = req.body;

        const request = new sql.Request();

        request.input("name", sql.VarChar, name);
        request.input("email", sql.VarChar, email);
        request.input("position", sql.VarChar, position);
        request.input("salary", sql.Decimal(10, 2), salary);

        const result = await request.query(`
            INSERT INTO dbo.Employees
                (Name, Email, Position, Salary)
            OUTPUT INSERTED.*
            VALUES
                (@name, @email, @position, @salary)
        `);

        res.status(201).json({
            message: "Employee created successfully",
            employee: result.recordset[0]
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Database error"
        });
    }
};


// UPDATE EMPLOYEE
const updateEmployee = async (req, res) => {

    try {

        const id = req.params.id;

        const { name, email, position, salary } = req.body;

        const request = new sql.Request();

        request.input("id", sql.Int, id);
        request.input("name", sql.VarChar, name);
        request.input("email", sql.VarChar, email);
        request.input("position", sql.VarChar, position);
        request.input("salary", sql.Decimal(10, 2), salary);

        const result = await request.query(`
            UPDATE dbo.Employees
            SET
                Name = @name,
                Email = @email,
                Position = @position,
                Salary = @salary
            OUTPUT INSERTED.*
            WHERE Id = @id
        `);

        if (result.recordset.length === 0) {

            return res.status(404).json({
                message: "Employee not found"
            });

        }

        res.json({
            message: "Employee updated successfully",
            employee: result.recordset[0]
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Database error"
        });
    }
};

// DELETE EMPLOYEE
const deleteEmployee = async (req, res) => {

    try {

        const id = req.params.id;

        const request = new sql.Request();

        request.input("id", sql.Int, id);

        const result = await request.query(`
            DELETE FROM dbo.Employees
            OUTPUT DELETED.*
            WHERE Id = @id
        `);

        if (result.recordset.length === 0) {

            return res.status(404).json({
                message: "Employee not found"
            });

        }

        res.json({
            message: "Employee deleted successfully",
            employee: result.recordset[0]
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Database error"
        });
    }
};  


module.exports = {
    getEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee
};