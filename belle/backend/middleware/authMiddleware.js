const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
        return res.status(401).json({ erro: 'Acesso negado. Token não fornecido.' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ erro: 'Token mal formatado.' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        return res.status(500).json({ erro: 'Erro interno de configuração de segurança do servidor.' });
    }

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(403).json({ erro: 'Token inválido ou expirado.' });
        }
        
        req.usuario = decoded;
        next();
    });
}

module.exports = verificarToken;