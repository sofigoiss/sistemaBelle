const mysql = require('mysql2');
require('dotenv').config();

// Criar a ligação com a base de dados utilizando as variáveis de ambiente
const conexao = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'admin',
    database: process.env.DB_NAME || 'sistema_belle'
});

// Testar a ligação
conexao.connect((erro) => {
    if (erro) {
        console.error('Erro ao conectar ao banco de dados MySQL:', erro.stack);
        return;
    }
    console.log('Conexão bem-sucedida com o banco de dados MySQL!');
});

module.exports = conexao;