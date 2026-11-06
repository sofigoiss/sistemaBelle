const express = require('express');
const router = express.Router();
const publicacaoController = require('../controllers/publicacaoController');

// Exemplo das rotas que deves ter lá dentro:
router.get('/', publicacaoController.listarPublicacoes);
router.post('/', publicacaoController.criarPublicacao);

// Rotas de comentários
router.get('/:publicacao_id/comentarios', publicacaoController.listarComentarios);
router.post('/:publicacao_id/comentarios', publicacaoController.criarComentario);

module.exports = router;