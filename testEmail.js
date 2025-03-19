const nodemailer = require("nodemailer");

async function testEmail() {
    try {
        const transporter = nodemailer.createTransport({
            service: "Outlook365",
            auth: {
                user: "erick.prado@sfiems.com.br",
                pass: "!out@2024!"
            }
        });

        await transporter.verify();
        console.log("✅ Conexão com o e-mail está funcionando!");
    } catch (error) {
        console.error("❌ Erro ao conectar ao servidor de e-mail:", error.message);
    }
}

testEmail();
