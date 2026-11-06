const db = require('../database/conexao');

// Listar todas as publicações (Feed)
const listarPublicacoes = async (req, res) => {
    try {
        const [linhas] = await db.query(`
            SELECT p.*, u.nome 
            FROM publicacoes p
            LEFT JOIN usuarios u ON p.usuario_id = u.id
            ORDER BY p.id DESC
        `);
        res.json(linhas);
    } catch (erro) {
        console.error('Erro ao listar publicações:', erro);
        try {
            const [linhas] = await db.query('SELECT * FROM publicacoes ORDER BY id DESC');
            res.json(linhas);
        } catch (erro2) {
            res.json([]);
        }
    }
};

// Criar nova publicação
const criarPublicacao = async (req, res) => {
    try {
        const { usuario_id, titulo, preco, imagem_url, descricao } = req.body;
        const idUsuario = usuario_id || 3; 

        await db.query(
            'INSERT INTO publicacoes (usuario_id, titulo, preco, imagem_url, descricao) VALUES (?, ?, ?, ?, ?)',
            [idUsuario, titulo || 'Sem título', preco || 0, imagem_url || '', descricao || '']
        );

        res.status(201).json({ mensagem: 'Publicação criada com sucesso! 🌸' });
    } catch (erro) {
        console.error('Erro ao criar publicação:', erro);
        res.status(500).json({ erro: 'Erro interno ao criar publicação.' });
    }
};

// Atualizar publicação existente
const atualizarPublicacao = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, preco, imagem_url, descricao } = req.body;

        await db.query(
            'UPDATE publicacoes SET titulo = ?, preco = ?, imagem_url = ?, descricao = ? WHERE id = ?',
            [titulo, preco || 0, imagem_url || '', descricao || '', id]
        );

        res.json({ mensagem: 'Publicação atualizada com sucesso! 🌸' });
    } catch (erro) {
        console.error('Erro ao atualizar publicação:', erro);
        res.status(500).json({ erro: 'Erro interno ao atualizar publicação.' });
    }
};

// Apagar publicação
const apagarPublicacao = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM publicacoes WHERE id = ?', [id]);
        res.json({ mensagem: 'Publicação apagada com sucesso! 🌸' });
    } catch (erro) {
        console.error('Erro ao apagar publicação:', erro);
        res.status(500).json({ erro: 'Erro interno ao apagar publicação.' });
    }
};

// Listar comentários de uma publicação
const listarComentarios = async (req, res) => {
    try {
        const { publicacao_id } = req.params;
        const [linhas] = await db.query(`
            SELECT c.*, u.nome 
            FROM comentarios c
            LEFT JOIN usuarios u ON c.usuario_id = u.id
            WHERE c.publicacao_id = ?
            ORDER BY c.id ASC
        `, [publicacao_id]);
        res.json(linhas);
    } catch (erro) {
        console.error('Erro ao listar comentários:', erro);
        res.status(500).json({ erro: 'Erro interno ao carregar comentários.' });
    }
};

// Criar um comentário
const criarComentario = async (req, res) => {
    try {
        const { publicacao_id } = req.params;
        const { texto, usuario_id } = req.body;
        const idUsuario = usuario_id || 3;

        if (!texto) {
            return res.status(400).json({ erro: 'O comentário não pode estar vazio.' });
        }

        await db.query(
            'INSERT INTO comentarios (publicacao_id, usuario_id, texto) VALUES (?, ?, ?)',
            [publicacao_id, idUsuario, texto]
        );

        res.status(201).json({ mensagem: 'Comentário adicionado com sucesso! 🌸' });
    } catch (erro) {
        console.error('Erro ao criar comentário:', erro);
        res.status(500).json({ erro: 'Erro interno ao criar comentário.' });
    }
};

module.exports = {
    criarPublicacao,
    listarPublicacoes,
    atualizarPublicacao,
    apagarPublicacao,
    listarComentarios,
    criarComentario
};