// middlewares/ensureAuthenticated.js
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    // Se não estiver autenticado, redireciona para /auth/login
    res.redirect("/auth/login");
  }
  
  module.exports = ensureAuthenticated;
  