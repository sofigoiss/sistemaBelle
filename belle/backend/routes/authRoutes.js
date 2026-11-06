const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Apenas rotas de autenticação
router.post('/login', authController.login);
router.post('/registrar', authController.registrar);

module.exports = router;