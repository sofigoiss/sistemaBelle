const express = require('express');
const cors = require('cors');
require('dotenv').config();
// Importar as rotas
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json()); // Permite receber dados em formato JSON nas requisições

// Definir as rotas da API
app.use('/api/auth', authRoutes);

// Rota de teste simples
app.get('/', (req, res) => {
    res.json({ mensagem: 'API do Sistema Belle a funcionar com sucesso!' });
});

// Definir a porta (usa a do .env ou a porta 3000 por defeito)
const PORT = process.env.PORT || 3000;

// Colocar o servidor a escutar no terminal
app.listen(PORT, () => {
    console.log(`Servidor a rodar com sucesso na porta ${PORT}! 🚀`);
});