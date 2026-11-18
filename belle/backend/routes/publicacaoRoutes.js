const express = require('express');
const router = express.Router();
const publicacaoController = require('../controllers/publicacaoController');
const verificarToken = require('../middleware/authMiddleware');

// Exemplo das rotas que deves ter lá dentro:
router.get('/', publicacaoController.listarPublicacoes);
router.post('/', verificarToken, publicacaoController.criarPublicacao);
router.put('/:id', verificarToken, publicacaoController.atualizarPublicacao);
router.delete('/:id', verificarToken, publicacaoController.apagarPublicacao);

// Rotas de comentários
router.get('/:publicacao_id/comentarios', publicacaoController.listarComentarios);
router.post('/:publicacao_id/comentarios', verificarToken, publicacaoController.criarComentario);

module.exports = router;