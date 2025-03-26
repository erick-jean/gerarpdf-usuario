require("dotenv").config();
const express = require("express");
const session = require("express-session");
//const passport = require("./auth"); // Arquivo de configuração do Passport/Azure AD
const path = require("path");
const cors = require("cors");
const logger = require("./logger");

// Rotas
//const authRoutes = require("./routes/authRoutes");
const emailRoutes = require("./routes/emailRoutes");
const logRoutes = require("./routes/logRoutes");
//const indexRoutes = require("./routes/indexRoutes");

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === "production";

// 1. Configuração de sessão
// app.use(session({
//     secret: process.env.SESSION_SECRET || "chave-secreta", // Melhor usar uma variável de ambiente
//     resave: false,
//     saveUninitialized: false,
//     cookie: { 
//         secure: isProduction,  // Apenas ativar em produção
//         httpOnly: true,        // Protege contra ataques XSS
//         sameSite: "strict"     // Protege contra CSRF
//     }
// }));

// 2. Inicialização do Passport (Azure AD)
//app.use(passport.initialize());
//app.use(passport.session());

// 3. Configuração de CORS
app.use(cors({
    origin: isProduction ? "https://hmpdfusers.fiems.com.br" : "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// 4. Permite receber JSON e form-urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// // 5. Middleware para servir arquivos estáticos
// app.use("/static", express.static(path.join(__dirname, "public")));

app.use(express.static(path.join(__dirname, 'public')));

// 6. Uso das rotas separadas
//app.use("/auth", authRoutes);       
app.use("/api", emailRoutes);       
app.use("/log", logRoutes);         
//app.use("/", indexRoutes);

// 7. Rota 404 (caso nenhuma rota acima atenda)
app.use((req, res) => {
    res.status(404).json({ message: "Rota não encontrada" });
});

// 8. Middleware global de tratamento de erros
app.use((err, req, res, next) => {
    logger.error(`❌ Erro: ${err.message}`);
    if (!isProduction) {
        res.status(500).json({ message: "Algo deu errado!", error: err.stack });
    } else {
        res.status(500).json({ message: "Algo deu errado!" });
    }
});

// 9. Inicia o servidor
app.listen(PORT, "0.0.0.0", () => {
    logger.info(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
