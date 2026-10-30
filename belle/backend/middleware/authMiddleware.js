const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'segredo_super_seguro_belle';

const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
        return res.status(401).json({ erro: 'Acesso negado. Nenhum token fornecido.' });
    }

    // O formato do cabeçalho costuma ser "Bearer TOKEN"
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ erro: 'Formato de token inválido.' });
    }

    try {
        const decodificado = jwt.verify(token, JWT_SECRET);
        req.usuario = decodificado; // Guarda os dados do utilizador na requisição
        next(); // Permite continuar para a rota pretendida
    } catch (erro) {
        return res.status(403).json({ erro: 'Token inválido ou expirado.' });
    }
};

module.exports = verificarToken;