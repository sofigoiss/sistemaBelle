const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Formato: "Bearer TOKEN"

    if (!token) {
        return res.status(401).json({ erro: 'Acesso negado. Token não fornecido.' });
    }

    try {
        const segredo = process.env.JWT_SECRET || 'chave_secreta_padrao';
        const decodificado = jwt.verify(token, segredo);
        req.usuario = decodificado; // Guarda os dados do utilizador na requisição
        next();
    } catch (erro) {
        return res.status(403).json({ erro: 'Token inválido ou expirado.' });
    }
};

module.exports = verificarToken;