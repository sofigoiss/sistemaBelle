const db = require('../database/conexao');

// Listar todas as publicações (Feed)
const listarPublicacoes = async (req, res) => {
    try {
        const [linhas] = await db.query(`
            SELECT p.*, u.nome AS nome_trabalhador
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
            res.status(500).json({ erro: 'Erro interno ao carregar publicações.' });
        }
    }
};

// Criar nova publicação
const criarPublicacao = async (req, res) => {
    try {
        const { titulo, preco, imagem_url, descricao } = req.body;

        if (!titulo || !String(titulo).trim()) {
            return res.status(400).json({ erro: 'O título é obrigatório.' });
        }

        if (req.usuario.tipo_usuario && req.usuario.tipo_usuario !== 'trabalhador') {
            return res.status(403).json({ erro: 'Apenas trabalhadores podem criar publicações.' });
        }

        const idUsuario = req.usuario.id;

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

        if (!/^\d+$/.test(id)) {
            return res.status(400).json({ erro: 'ID da publicação inválido.' });
        }

        if (!titulo || !String(titulo).trim()) {
            return res.status(400).json({ erro: 'O título é obrigatório.' });
        }

        const [existentes] = await db.query(
            'SELECT id FROM publicacoes WHERE id = ? AND usuario_id = ?',
            [id, req.usuario.id]
        );

        if (existentes.length === 0) {
            return res.status(404).json({ erro: 'Publicação não encontrada ou não lhe pertence.' });
        }

        await db.query(
            'UPDATE publicacoes SET titulo = ?, preco = ?, imagem_url = ?, descricao = ? WHERE id = ? AND usuario_id = ?',
            [titulo.trim(), preco || 0, imagem_url || '', descricao || '', id, req.usuario.id]
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

        if (!/^\d+$/.test(id)) {
            return res.status(400).json({ erro: 'ID da publicação inválido.' });
        }

        const [existentes] = await db.query(
            'SELECT id FROM publicacoes WHERE id = ? AND usuario_id = ?',
            [id, req.usuario.id]
        );

        if (existentes.length === 0) {
            return res.status(404).json({ erro: 'Publicação não encontrada ou não lhe pertence.' });
        }

        await db.query('DELETE FROM publicacoes WHERE id = ? AND usuario_id = ?', [id, req.usuario.id]);
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
        const { texto } = req.body;

        if (!/^\d+$/.test(publicacao_id)) {
            return res.status(400).json({ erro: 'ID da publicação inválido.' });
        }

        if (!texto || !String(texto).trim()) {
            return res.status(400).json({ erro: 'O comentário não pode estar vazio.' });
        }

        const [publicacoes] = await db.query('SELECT id FROM publicacoes WHERE id = ?', [publicacao_id]);
        if (publicacoes.length === 0) {
            return res.status(404).json({ erro: 'Publicação não encontrada.' });
        }

        await db.query(
            'INSERT INTO comentarios (publicacao_id, usuario_id, texto) VALUES (?, ?, ?)',
            [publicacao_id, req.usuario.id, texto.trim()] 
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