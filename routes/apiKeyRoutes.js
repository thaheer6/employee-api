const express = require("express");

const {
    generateApiKey
} = require("../controllers/apiKeyController");

const router = express.Router();

router.post("/keys", generateApiKey);

module.exports = router;