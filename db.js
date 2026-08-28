require("dotenv").config();

const sql = require("mssql");

const config = {
    server: process.env.DB_SERVER,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_DATABASE,

    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,

    options: {
        trustServerCertificate: true
    }
};

sql.connect(config)
    .then(() => {
        console.log("Connected to SQL Server");
    })
    .catch((err) => {
        console.error("Database connection failed:", err);
    });

module.exports = sql;