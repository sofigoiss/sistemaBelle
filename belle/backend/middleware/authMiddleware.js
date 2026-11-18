const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ erro: 'Acesso negado. Token não fornecido.' });
    }

    const partes = authHeader.trim().split(/\s+/);
    if (partes.length !== 2 || partes[0].toLowerCase() !== 'bearer' || !partes[1]) {
        return res.status(401).json({ erro: 'Token mal formatado.' });
    }

    const segredo = process.env.JWT_SECRET || 'chave_secreta_padrao';
    jwt.verify(partes[1], segredo, (err, decoded) => {
        if (err) {
            return res.status(403).json({ erro: 'Token inválido ou expirado.' });
        }

        if (!decoded || !decoded.id) {
            return res.status(403).json({ erro: 'Token não contém os dados do utilizador.' });
        }

        req.usuario = decoded;
        next();
    });
}

module.exports = verificarToken;