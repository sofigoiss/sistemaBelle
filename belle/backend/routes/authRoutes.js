const express = require('express');
const router = express.Router();
const { registrar, login } = require('../controllers/authController');

// Rota de Registo: POST /api/auth/registrar
router.post('/registrar', registrar);

// Rota de Login: POST /api/auth/login
router.post('/login', login);

module.exports = router;