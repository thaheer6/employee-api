const crypto = require("crypto");
const sql = require("../db");

const generateApiKey = async (req, res) => {

    try {

        const { clientName } = req.body;

        if (!clientName) {
            return res.status(400).json({
                message: "Client name is required"
            });
        }

        // Generate a secure random API key
        const apiKey = crypto.randomBytes(32).toString("hex");

        // Create a SHA-256 hash of the API key
        const keyHash = crypto
            .createHash("sha256")
            .update(apiKey)
            .digest("hex");

        // Store only the hash in the database
        const request = new sql.Request();

        request.input("clientName", sql.VarChar(100), clientName);
        request.input("keyHash", sql.VarChar(64), keyHash);

        const result = await request.query(`
            INSERT INTO dbo.ApiKeys
                (ClientName, KeyHash)
            OUTPUT INSERTED.Id,
                   INSERTED.ClientName,
                   INSERTED.IsActive,
                   INSERTED.CreatedAt,
                   INSERTED.ExpiresAt
            VALUES
                (@clientName, @keyHash)
        `);

        // Return the actual API key to the client
        res.status(201).json({
            message: "API key generated successfully",
            apiKey: apiKey,
            details: result.recordset[0]
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Failed to generate API key"
        });
    }
};

module.exports = {
    generateApiKey
};