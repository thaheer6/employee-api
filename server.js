const express = require("express");
const employeeRoutes = require("./routes/employeeRoutes");
const apiKeyRoutes = require("./routes/apiKeyRoutes");
require("./db");

const app = express();

app.use(express.json());

const port = 5000;

// Connect employee routes
app.use("/api", employeeRoutes);

// Connect API key routes
app.use("/api", apiKeyRoutes);

app.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`);
});