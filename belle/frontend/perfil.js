const API_BASE = 'http://localhost:3000/api';

const urlParams = new URLSearchParams(window.location.search);
const usuarioId = urlParams.get('id');

const perfilNome = document.getElementById('perfil-nome');
const perfilBadge = document.getElementById('perfil-badge');
const perfilAvatar = document.getElementById('profile-avatar');
const perfilSubtitulo = document.getElementById('perfil-subtitulo');
const statCount = document.getElementById('stat-count');
const feedTituloPerfil = document.getElementById('feed-titulo-perfil');
const perfilFeedContainer = document.getElementById('perfil-feed-container');

document.addEventListener('DOMContentLoaded', () => {
    if (!usuarioId) {
        perfilNome.innerText = 'Utilizador não encontrado';
        perfilFeedContainer.innerHTML = '<p>Nenhum ID de utilizador especificado.</p>';
        return;
    }
    carregarDadosPerfil();
});

async function carregarDadosPerfil() {
    try {
        const resposta = await fetch(`${API_BASE}/publicacoes`);
        const publicacoes = await resposta.json();

        // Filtra os posts do utilizador
        const postsDoUtilizador = publicacoes.filter(post => post.usuario_id == usuarioId);

        if (postsDoUtilizador.length > 0) {
            const nomeTrabalhador = postsDoUtilizador[0].nome_trabalhador || 'Produtor';
            
            // Configurar Cabeçalho
            perfilNome.innerText = nomeTrabalhador;
            perfilAvatar.innerText = nomeTrabalhador.charAt(0).toUpperCase();
            perfilSubtitulo.innerText = `Espaço de divulgação oficial de ${nomeTrabalhador}`;
            statCount.innerText = postsDoUtilizador.length;
            feedTituloPerfil.innerText = `Vitrina de ${nomeTrabalhador}`;
            
            renderizarFeedPerfil(postsDoUtilizador);
        } else {
            perfilNome.innerText = 'Perfil do Produtor';
            perfilAvatar.innerText = '?';
            perfilSubtitulo.innerText = 'Este produtor ainda não tem publicações ativas no feed.';
            statCount.innerText = '0';
            perfilFeedContainer.innerHTML = '<p>Nenhuma publicação encontrada para este perfil.</p>';
        }

    } catch (erro) {
        console.error('Erro ao carregar perfil:', erro);
        perfilFeedContainer.innerHTML = '<p>Erro ao carregar as informações do perfil.</p>';
    }
}

function renderizarFeedPerfil(publicacoes) {
    perfilFeedContainer.innerHTML = publicacoes.map(post => `
        <article class="post-card">
            <img src="${post.imagem_url || 'https://via.placeholder.com/300x190?text=Sem+Imagem'}" alt="${post.titulo}">
            <div class="post-content">
                <h3 class="post-title">${post.titulo}</h3>
                <div class="post-price">R$ ${parseFloat(post.preco || 0).toFixed(2)}</div>
                <p class="post-desc">${post.descricao || 'Sem descrição.'}</p>
                <div class="post-author">Por: <strong>${post.nome_trabalhador}</strong></div>
            </div>
        </article>
    `).join('');
}