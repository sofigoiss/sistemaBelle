const db = require('../database/conexao.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 1. Registo de utilizadores (POST /api/auth/registrar)
const registrar = async (req, res) => {
    try {
        const { nome, email, senha, tipo_usuario } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({ erro: 'Por favor, preencha todos os campos obrigatórios.' });
        }

        const [usuarioExiste] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (usuarioExiste.length > 0) {
            return res.status(400).json({ erro: ' Este email já está a ser utilizado.' });
        }

        const senhaHash = await bcrypt.hash(senha, 10);
        const tipoFinal = tipo_usuario || 'cliente';

        await db.query(
            'INSERT INTO usuarios (nome, email, senha, tipo_usuario) VALUES (?, ?, ?, ?)',
            [nome, email, senhaHash, tipoFinal]
        );

        res.status(201).json({ mensagem: 'Utilizador registado com sucesso!' });
    } catch (erro) {
        console.error('Erro no registo:', erro);
        res.status(500).json({ erro: 'Erro interno ao registar utilizador.' });
    }
};

// 2. Login de utilizadores (POST /api/auth/login)
const login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ erro: 'Forneça o email e a senha.' });
        }

        const [usuarios] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (usuarios.length === 0) {
            return res.status(401).json({ erro: 'Credenciais inválidas.' });
        }

        const usuario = usuarios[0];
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(401).json({ erro: 'Credenciais inválidas.' });
        }

        const token = jwt.sign(
            { id: usuario.id, nome: usuario.nome, tipo_usuario: usuario.tipo_usuario },
            process.env.JWT_SECRET || 'chave_secreta_padrao',
            { expiresIn: '24h' }
        );

        res.json({
            mensagem: 'Login efetuado com sucesso!',
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                tipo_usuario: usuario.tipo_usuario
            }
        });
    } catch (erro) {
        console.error('Erro no login:', erro);
        res.status(500).json({ erro: 'Erro interno ao realizar login.' });
    }
};

module.exports = {
    login,
    registrar
};