const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar as rotas do sistema
const authRoutes = require('./routes/authRoutes');
const publicacaoRoutes = require('./routes/publicacaoRoutes');

// Inicializar o Express
const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json()); // Permite receber dados em formato JSON nas requisições

// Definir as rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/publicacoes', publicacaoRoutes);

// Rota de teste simples para verificar se a API está viva
app.get('/', (req, res) => {
    res.json({ mensagem: 'API do Sistema Belle a funcionar com sucesso! 🌸' });
});

// Definir a porta (usa a do .env ou a porta 3000 por defeito)
const PORT = process.env.PORT || 3000;

// Colocar o servidor a escutar no terminal
app.listen(PORT, () => {
    console.log(`Servidor a correr na porta ${PORT} 🚀`);
});