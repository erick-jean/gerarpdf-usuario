// routes/authRoutes.js
const express = require("express");
const passport = require("../auth");
const logger = require("../logger");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated"); // Verifique o caminho correto

const router = express.Router();

// Rota para iniciar o login (sem o prefixo "/auth")
router.get("/login", passport.authenticate("azuread-openidconnect"));

// Callback após login no Azure
router.get("/callback",
    passport.authenticate("azuread-openidconnect", { failureRedirect: "/" }),
    (req, res) => {
        if (!req.user) {
            logger.error("Erro ao autenticar usuário.");
            return res.status(401).send("Erro ao autenticar usuário.");
        }
        logger.info(`Usuário autenticado: ${req.user.displayName}`);
        res.redirect("/");
    }
);

// Logout
router.get("/logout", (req, res, next) => {
    // ... sua lógica de logout aqui ...
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.session.destroy((err) => {
            if (err) {
                logger.error("Erro ao destruir sessão:", err);
                return res.status(500).send("Erro ao fazer logout.");
            }
            res.clearCookie("connect.sid");
            res.redirect("https://login.microsoftonline.com/common/oauth2/logout?post_logout_redirect_uri=https://hmpdfusers.fiems.com.br/");
        });
    });
});

// Endpoint para retornar dados do usuário autenticado
router.get("/user", ensureAuthenticated, (req, res) => {
    res.json({
        displayName: req.user.displayName,
        email: req.user.emails && req.user.emails[0] ? req.user.emails[0].value : null,
    });
});

module.exports = router;
