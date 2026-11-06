const mysql = require('mysql2');
require('dotenv').config();

const conexao = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'admin',
    database: process.env.DB_NAME || 'sistema_belle'
}).promise();

console.log('Pool de conexão com o MySQL configurada com sucesso!');

module.exports = conexao;