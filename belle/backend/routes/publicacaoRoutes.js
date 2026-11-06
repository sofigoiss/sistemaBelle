const express = require('express');
const router = express.Router();
const { 
    criarPublicacao, 
    listarPublicacoes, 
    atualizarPublicacao, 
    apagarPublicacao 
} = require('../controllers/publicacaoController');

// Rotas públicas / Livres para testes do Feed
router.get('/', listarPublicacoes); // Listar todas as publicações
router.post('/', criarPublicacao);   // Criar post (sem token para testes)
router.put('/:id', atualizarPublicacao); // Atualizar post
router.delete('/:id', apagarPublicacao); // Apagar post

module.exports = router;