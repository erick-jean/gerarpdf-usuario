// routes/logRoutes.js
const express = require("express");
const logger = require("../logger");

const router = express.Router();

router.post("/", (req, res) => {
  const { level, message } = req.body;

  // Registrar o log usando o logger
  switch (level) {
    case "info":
      logger.info(message);
      break;
    case "warn":
      logger.warn(message);
      break;
    case "error":
      logger.error(message);
      break;
    default:
      logger.info(message); // Padrão para logs não especificados
  }

  res.status(200).send("Log recebido");
});

module.exports = router;
