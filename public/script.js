function carregarDados() {
    fetch('/api/dados') // Chama a API do Node.js
        .then(response => response.json())
        .then(data => {
            document.getElementById('resultado').textContent = data.mensagem;
        })
        .catch(error => console.error('Erro ao buscar dados:', error));
 }

 function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Função para enviar logs para o back-end
function enviarLog(level, message) {
    fetch('/log', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ level, message }),
    })
    .then(response => {
        if (!response.ok) {
            console.error('Erro ao enviar log');
        }
    })
    .catch(error => {
        console.error('Erro na requisição:', error);
    });
}

 
 function gerarPDF() {
    // Capturar os valores dos inputs
    const nome = document.getElementById("nome").value.trim();
    const login = document.getElementById("login").value.trim();
    const dominio = document.getElementById("dominio").value.trim();
    const senha = document.getElementById("senha").value.trim() || "!sfiems@2025!";
    const senhaImpressao = document.getElementById("senha_impressao").value.trim();
    const emailDestino = document.getElementById("emailDestino").value.trim();
 
    if (!validarEmail(emailDestino)) {
        exibirMensagemFalha("Por favor, insira um e-mail válido.");
        enviarLog('error', `E-mail inválido ${emailDestino}`);              
        return;
    }

    // 🚨 Validação dos campos obrigatórios antes de continuar
    if (!nome || !login || !emailDestino) {
        exibirMensagemFalha("Todos os campos devem ser preenchidos corretamente antes de baixar o arquivo!");
        enviarLog('error', 'Campos obrigatórios não preenchidos');        
        return;
    }
 
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF("p", "mm", "a4", true); // Formato A4 em modo retrato
    const imgPath = "/assets/images/Imagem2.png"; // Caminho correto da imagem
 
    // Criar a imagem de fundo
    const img = new Image();
    img.src = imgPath;
    img.onload = function () {
        gerarConteudoPDF(doc, nome, login, dominio, senha, senhaImpressao, emailDestino);
    };
 
    img.onerror = function () {
        console.error("Erro ao carregar a imagem de fundo!");
        alert("Erro ao carregar a imagem de fundo. Verifique o caminho do arquivo.");
        enviarLog('error', 'Erro ao carregar a imagem de fundo');
    };
 }
 
 function gerarConteudoPDF(doc, nome, login, dominio, senha, senhaImpressao, emailDestino) {
    const pageWidth = 210;
    const pageHeight = 297;
    const margemEsquerda = 20;
    const margemDireita = 20;
    const larguraUtilizavel = pageWidth - margemEsquerda - margemDireita;
    let posY = 50;
 
    // Adicionar imagem ao fundo
    doc.addImage("/assets/images/Imagem2.png", "PNG", 0, 0, pageWidth, pageHeight);
 
    // Adicionar título centralizado
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Dados do Novo Usuário", 105, posY, { align: "center" });
    posY += 12;
 
    // Adicionar dados do usuário
    const dadosUsuario = [
        ["Nome:", nome],
        ["Windows Login:", login],
        ["E-mail:", `${login}${dominio}`],
        ["Senha Inicial:", senha],
        ["Senha de Impressão:", senhaImpressao],
    ];
 
    doc.setFontSize(12);
    dadosUsuario.forEach(([label, valor]) => {
        doc.setFont("helvetica", "bold");
        doc.text(label, margemEsquerda, posY);
        doc.setFont("helvetica", "normal");
        doc.text(valor, margemEsquerda + 60, posY);
        posY += 8;
    });
 
    posY += 10;
 
    // Adicionar instruções importantes
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(255, 0, 0);
    doc.text("Instruções Importantes:", margemEsquerda, posY);
    posY += 7;
 
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
 
    const instrucoes = [
        "• Troca de Senha no Primeiro Login:",
        "   - Ao acessar o sistema pela primeira vez, você será solicitado a alterar a senha inicial fornecida.",
        "   - Atenção: A alteração da senha é obrigatória para garantir a segurança da sua conta.",
        "",
        "• Requisitos de Complexidade da Senha:",
        "  - A nova senha deve atender aos seguintes critérios de complexidade:",
        "  - Comprimento mínimo: 6 (seis) caracteres.",
        "  - Não conter o nome da conta do usuário ou partes do nome completo do usuário que excedam dois caracteres consecutivos;",
        "  - Conter caracteres de três das quatro categorias a seguir:Deve incluir pelo menos 3 dos seguintes:",
        "     * Letras maiúsculas (A-Z);",
        "     * Letras minúsculas (a-z);",
        "     * Base 10 dígitos (0 a 9);",
        "     * Caracteres não alfabéticos (por exemplo: @,!, $, #, %); ",
        "",
        "• Acesso à Central de Atendimento de TI (CA):",
        "  - Para acessar a Central de Atendimento de TI (CA) acesse o site sd.sfiems.org.br e informe seu login do CA e senha.Em caso de dúvidas, o time de TI está à disposição pelo telefone (67) 3389-9066.",
        
    ];
 
    instrucoes.forEach((linha) => {
        const textoQuebrado = doc.splitTextToSize(linha, larguraUtilizavel);
        doc.text(textoQuebrado, margemEsquerda, posY);
        posY += 6 * textoQuebrado.length;
    });
 
    const nomeArquivo = `Login e Senha Novo Colaborador - ${nome}.pdf`;
 
    // 🚀 Salvar o PDF
    doc.save(nomeArquivo);
    enviarLog('info', `PDF gerado com sucesso: ${nomeArquivo} pelo usuário: ${currentUser ? currentUser.displayName : "Usuário não identificado"}`);    
 
    // 🎉 Exibir notificação de sucesso
    exibirMensagemSucesso("Arquivo gerado com sucesso! Enviando por e-mail...",
        setTimeout(() => {
            location.reload(); // Recarrega a página após 2 segundos
        }, 2000)
    );
 
    // 📤 Enviar o PDF por e-mail
    enviarEmail(doc, nomeArquivo, emailDestino);
 }
 
 function exibirMensagemSucesso(mensagemTexto) {
    const mensagem = document.getElementById("mensagem-sucesso");
    // Define o conteúdo da mensagem
    mensagem.innerHTML = mensagemTexto;
    mensagem.style.display = "block";
    setTimeout(() => {
        mensagem.style.display = "none";
    }, 4000);
 }

 function exibirMensagemFalha(mensagemTexto) {
    const mensagem = document.getElementById("mensagem-falha");
    
    // Define o conteúdo da mensagem
    mensagem.innerHTML = mensagemTexto;
    
    // Exibe a mensagem
    mensagem.style.display = "block";
    
    // Oculta a mensagem após 4 segundos
    setTimeout(() => {
        mensagem.style.display = "none";
    }, 4000);
}
 
 function enviarEmail(doc, nomeArquivo, emailDestino) {
    const pdfBlob = doc.output("blob");
 
    const formData = new FormData();
    formData.append("pdfFile", pdfBlob, nomeArquivo);
    formData.append("emailDestino", emailDestino);
 
    const baseUrl = window.location.origin.includes("localhost") 
    ? "http://localhost:3000" 
    : "https://hmpdfusers.fiems.com.br";

    fetch(`${baseUrl}/api/enviar-email`, {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => alert(data.message))
    .catch(error => {
        console.error("Erro ao enviar e-mail:", error);
        enviarLog('error', `Erro ao enviar e-mail: ${error.message}`);
    });
 }

 let currentUser = null;

//Função para carregar dados do usuário logado
function carregarUsuario() {
    fetch('/api/user')
        .then(response => response.json())
        .then(data => {
            currentUser = data;
        })
        .catch(error => console.error("Erro ao carregar dados do usuário:", error));
}
carregarUsuario();

