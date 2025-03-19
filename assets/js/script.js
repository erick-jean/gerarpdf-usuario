function gerarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF("p", "mm", "a4"); // Formato A4 em modo retrato

    // Caminho da imagem de fundo (certifique-se de que a imagem esteja acessível)
    const imgPath = "assets/images/Imagem2.png"; // Substitua pelo caminho correto da imagem

    // Definir a largura e altura do A4 em milímetros
    const pageWidth = 210;
    const pageHeight = 297;

    // Carregar a imagem e adicionar ao fundo
    const img = new Image();
    img.src = imgPath;
    img.onload = function () {
        doc.addImage(img, "PNG", 0, 0, pageWidth, pageHeight);

        // Definir margens e configurações de layout
        const margemEsquerda = 20;
        const margemDireita = 20;
        const larguraUtilizavel = pageWidth - margemEsquerda - margemDireita;
        let posY = 50; // Posição inicial

        // Adicionar título centralizado
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.text("Dados do Novo Usuário", 105, posY, { align: "center" });
        posY += 12;

        // Capturar os valores dos inputs
        const nome = document.getElementById("nome").value || "Não informado";
        const login = document.getElementById("login").value || "Não informado";
        const dominio = document.getElementById("dominio").value || "@exemplo.com";
        const senha = document.getElementById("senha").value || "********";
        const senhaImpressao = document.getElementById("senha_impressao").value || "Não disponível";

        // Adicionar dados do usuário formatados
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

        // Adicionar título das instruções importantes
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(255, 0, 0);
        doc.text("Instruções Importantes:", margemEsquerda, posY);
        posY += 7;

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "normal");

        // Definir instruções com quebras de linha automáticas
        const instrucoes = [
            "• Troca de Senha no Primeiro Login:",
            "   - Ao acessar o sistema pela primeira vez, você será solicitado a alterar a senha inicial fornecida.",
            "   - Atenção: A alteração da senha é obrigatória para garantir a segurança da sua conta.",
            "",
            "• Requisitos de Complexidade da Senha:",
            "  - Comprimento mínimo: 6 caracteres.",
            "  - Não conter o nome da conta do usuário ou partes do nome completo do usuário que excedam dois caracteres consecutivos.",
            "  - Conter caracteres de três das quatro categorias a seguir:",
            "     * Caracteres maiúsculos (A a Z);",
            "     * Caracteres minúsculos (a a z);",
            "     * Base 10 dígitos (0 a 9);",
            "     * Caracteres não alfabéticos (exemplo: @, !, $, #, %).",
            "",
            "• Central de Atendimento de TI:",
            "  - Acesse o site sd.sfiems.org.br e informe seu login do CA e senha.",
            "  - Em caso de dúvidas, o time de TI está à disposição pelo telefone (67) 3389-9066."
        ];

        // Ajustar quebras de linha para melhor visualização
        instrucoes.forEach((linha) => {
            const textoQuebrado = doc.splitTextToSize(linha, larguraUtilizavel);
            doc.text(textoQuebrado, margemEsquerda, posY);
            posY += 6 * textoQuebrado.length;
        });

        // Salvar o PDF
        doc.save(`Login e Senha Novo Colaborador - ${nome}.pdf`);
    };
}
