// Rota raiz ("/") também protegida
// Assim, ao acessar "/", se não estiver logado, vai pra /auth/login
const express = require("express");
const path = require("path");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const router = express.Router();

// Rota raiz protegida
router.get("/", ensureAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

module.exports = router;
