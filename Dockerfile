# Usa a imagem oficial do Node.js
FROM node:20

# Define um usuário dentro do container (segurança)
RUN useradd -m appuser

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos package.json e package-lock.json antes de instalar as dependências
COPY package*.json ./

# Instala as dependências do projeto de forma limpa
RUN npm ci

# Copia todo o restante do código para dentro do container
COPY . .

# Define permissões para o usuário
RUN chown -R appuser:appuser /app

# Muda para o usuário sem privilégios (evita rodar como root)
USER appuser

# Expõe a porta do servidor (ajuste conforme necessário)
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "server.js"]
