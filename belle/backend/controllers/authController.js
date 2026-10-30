const conexao = require('../database/conexao');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Chave secreta para o JWT (o ideal é colocar no ficheiro .env)
const JWT_SECRET = process.env.JWT_SECRET || 'segredo_super_seguro_belle';

// 1. Registo de Novo Utilizador
const registrar = async (req, res) => {
    const { nome, email, senha, tipo_usuario } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ erro: 'Por favor, preenche todos os campos obrigatórios.' });
    }

    try {
        // Verificar se o email já existe
        conexao.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, resultados) => {
            if (err) return res.status(500).json({ erro: 'Erro no servidor ao verificar utilizador.' });
            
            if (resultados.length > 0) {
                return res.status(400).json({ erro: 'Este email já está registado.' });
            }

            // Encriptar a senha (hash) por razões de segurança
            const salt = await bcrypt.genSalt(10);
            const senhaHash = await bcrypt.hash(senha, salt);

            // Inserir o novo utilizador na base de dados
            const query = 'INSERT INTO usuarios (nome, email, senha, tipo_usuario) VALUES (?, ?, ?, ?)';
            const tipo = tipo_usuario || 'consumidor';

            conexao.query(query, [nome, email, senhaHash, tipo], (err, resultado) => {
                if (err) return res.status(500).json({ erro: 'Erro ao registar utilizador na base de dados.' });
                
                return res.status(201).json({ 
                    mensagem: 'Utilizador registado com sucesso!',
                    usuarioId: resultado.insertId 
                });
            });
        });
    } catch (erro) {
        return res.status(500).json({ erro: 'Erro interno no servidor.' });
    }
};

// 2. Login de Utilizador
const login = (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ erro: 'Por favor, introduz o email e a senha.' });
    }

    // Procurar o utilizador pelo email
    conexao.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, resultados) => {
        if (err) return res.status(500).json({ erro: 'Erro no servidor ao procurar utilizador.' });

        if (resultados.length === 0) {
            return res.status(401).json({ erro: 'Email ou senha inválidos.' });
        }

        const usuario = resultados[0];

        // Comparar a senha informada com a senha encriptada guardada no banco
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(401).json({ erro: 'Email ou senha inválidos.' });
        }

        // Gerar o Token JWT com os dados do utilizador e o perfil de acesso
        const token = jwt.sign(
            { id: usuario.id, email: usuario.email, tipo_usuario: usuario.tipo_usuario },
            JWT_SECRET,
            { expiresIn: '3h' } // Token expira em 3 horas
        );

        return res.status(200).json({
            mensagem: 'Login efetuado com sucesso!',
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                tipo_usuario: usuario.tipo_usuario
            }
        });
    });
};

module.exports = { registrar, login };