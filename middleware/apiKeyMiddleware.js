const crypto = require("crypto");
const sql = require("../db");

const apiKeyMiddleware = async (req, res, next) => {

    try {

        const apiKey = req.header("X-API-Key");

        if (!apiKey) {
            return res.status(401).json({
                message: "API key is missing"
            });
        }

        const keyHash = crypto
            .createHash("sha256")
            .update(apiKey)
            .digest("hex");

        const request = new sql.Request();

        request.input("keyHash", sql.VarChar(64), keyHash);

        const result = await request.query(`
            SELECT Id, ClientName, IsActive, ExpiresAt
            FROM dbo.ApiKeys
            WHERE KeyHash = @keyHash
        `);

        if (result.recordset.length === 0) {
            return res.status(401).json({
                message: "Invalid API key"
            });
        }

        const key = result.recordset[0];

        if (!key.IsActive) {
            return res.status(401).json({
                message: "API key is inactive"
            });
        }

        if (key.ExpiresAt && new Date(key.ExpiresAt) < new Date()) {
            return res.status(401).json({
                message: "API key has expired"
            });
        }

        req.apiKey = key;

        next();

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "API key validation failed"
        });
    }
};

module.exports = apiKeyMiddleware;