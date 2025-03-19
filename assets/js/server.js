const express = require("express");
const nodemailer = require("nodemailer");
const multer = require("multer");
const fs = require("fs");

const app = express();
const port = 3000;

// Configurar o multer para receber arquivos
const upload = multer({ dest: "uploads/" });

// Configurar o transporte SMTP
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "seuemail@gmail.com", // Substitua pelo seu e-mail
        pass: "suasenha" // Use uma senha de app se estiver usando Gmail
    }
});

// Endpoint para receber o PDF e enviar o e-mail
app.post("/enviar-email", upload.single("pdfFile"), (req, res) => {
    const { emailDestino } = req.body;
    const pdfPath = req.file.path;

    const mailOptions = {
        from: "seuemail@gmail.com",
        to: emailDestino,
        subject: "Novo PDF Gerado",
        text: "Segue em anexo o PDF gerado.",
        attachments: [
            {
                filename: "documento.pdf",
                path: pdfPath
            }
        ]
    };

    transporter.sendMail(mailOptions, (error, info) => {
        fs.unlinkSync(pdfPath); // Remove o arquivo após o envio
        if (error) {
            console.log(error);
            return res.status(500).json({ message: "Erro ao enviar e-mail." });
        }
        res.status(200).json({ message: "E-mail enviado com sucesso!" });
    });
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
