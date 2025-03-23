// routes/emailRoutes.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { body, validationResult } = require("express-validator");
const logger = require("../logger");
const enviarEmail = require("../emailService");

const router = express.Router();

// Cria a pasta de uploads, se não existir
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configuração do Multer para arquivos PDF
const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limite de 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Apenas arquivos PDF são permitidos."), false);
    }
  }
});

// Rota para receber o PDF e enviar por e-mail
router.post("/enviar-email", 
  upload.single("pdfFile"), 
  [
    body("emailDestino").isEmail().withMessage("E-mail inválido")
  ],
  (req, res) => {
    logger.info("🚀 Rota /enviar-email chamada!");

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error(`❌ Erro de validação: ${JSON.stringify(errors.array())}`);
      return res.status(400).json({ errors: errors.array() });
    }

    const { emailDestino } = req.body;

    if (!req.file) {
      logger.error("❌ Nenhum arquivo enviado.");
      return res.status(400).json({ message: "Nenhum arquivo enviado." });
    }

    const pdfPath = req.file.path;
    const pdfFilename = req.file.originalname || "arquivo.pdf";

    enviarEmail(emailDestino, pdfPath, pdfFilename)
      .then(() => {
        logger.info(`✅ E-mail enviado com sucesso para: ${emailDestino}`);
        res.status(200).json({ message: "📨 E-mail enviado com sucesso!" });
      })
      .catch(error => {
        logger.error(`❌ Erro ao enviar e-mail: ${error.message}`);
        res.status(500).json({ message: "Erro ao enviar e-mail." });
      });

    logger.info(`📨 E-mail em processamento para: ${emailDestino}`);
  }
);

module.exports = router;
