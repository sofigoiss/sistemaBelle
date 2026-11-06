const API_BASE = 'http://localhost:3000/api';

let usuarioLogado = JSON.parse(localStorage.getItem('usuario')) || null;
let token = localStorage.getItem('token') || null;
let listaPublicacoesGlobal = [];

const feedContainer = document.getElementById('feed-container');
const userArea = document.getElementById('user-area');
const formPublicacao = document.getElementById('form-publicacao');
const modalPost = document.getElementById('modal-post');
const btnAbrirModal = document.getElementById('btn-abrir-modal');
const inputPesquisa = document.getElementById('input-pesquisa');

document.addEventListener('DOMContentLoaded', () => {
    atualizarInterfaceUsuario();
    carregarPublicacoes();
});

// 1. Atualizar Perfil no Cabeçalho
function atualizarInterfaceUsuario() {
    if (usuarioLogado && token) {
        userArea.innerHTML = `
            <div class="user-profile-card">
                <div class="user-info">
                    <span class="user-name">${usuarioLogado.nome}</span>
                    <span class="user-badge">${usuarioLogado.tipo_usuario}</span>
                </div>
                <button class="btn-logout" onclick="fazerLogout()">Sair</button>
            </div>
        `;

        if (usuarioLogado.tipo_usuario === 'trabalhador') {
            btnAbrirModal.classList.remove('hidden');
        } else {
            btnAbrirModal.classList.add('hidden');
        }
    } else {
        btnAbrirModal.classList.add('hidden');
        userArea.innerHTML = `<a href="login.html" class="btn-login-link">Entrar / Registar</a>`;
    }
}

function fazerLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    token = null;
    usuarioLogado = null;
    atualizarInterfaceUsuario();
    carregarPublicacoes();
}

// 2. Controlo do Modal
function abrirModalPost() {
    modalPost.classList.remove('hidden');
}

function fecharModalPost() {
    modalPost.classList.add('hidden');
    limparFormularioPost();
}

// 3. Carregar Feed
async function carregarPublicacoes() {
    try {
        const resposta = await fetch(`${API_BASE}/publicacoes`);
        listaPublicacoesGlobal = await resposta.json();
        renderizarFeed(listaPublicacoesGlobal);
    } catch (erro) {
        console.error('Erro ao carregar feed:', erro);
        feedContainer.innerHTML = '<p>Erro ao carregar as publicações.</p>';
    }
}

function renderizarFeed(publicacoes) {
    if (publicacoes.length === 0) {
        feedContainer.innerHTML = '<p>Nenhuma publicação encontrada.</p>';
        return;
    }

    feedContainer.innerHTML = publicacoes.map(post => {
        const ehDono = usuarioLogado && usuarioLogado.id === post.usuario_id;

        return `
            <article class="post-card">
                <img src="${post.imagem_url || 'https://via.placeholder.com/300x190?text=Sem+Imagem'}" alt="${post.titulo}">
                <div class="post-content">
                    <h3 class="post-title">${post.titulo}</h3>
                    <div class="post-price">R$ ${parseFloat(post.preco || 0).toFixed(2)}</div>
                    <p class="post-desc">${post.descricao || 'Sem descrição.'}</p>
                    <div class="post-author">Por: <a href="perfil.html?id=${post.usuario_id}" class="author-link"><strong>${post.nome_trabalhador || 'Anónimo'}</strong></a></div>
                    
                    ${ehDono ? `
                        <div class="post-actions">
                            <button class="btn-edit" onclick="prepararEdicao(${post.id}, '${post.titulo}', ${post.preco}, '${post.imagem_url || ''}', '${post.descricao || ''}')">Editar</button>
                            <button class="btn-delete" onclick="apagarPublicacao(${post.id})">Apagar</button>
                        </div>
                    ` : ''}
                </div>
            </article>
        `;
    }).join('');
}

// 4. Criar ou Atualizar Publicação
if (formPublicacao) {
    formPublicacao.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = document.getElementById('post-id').value;
        const titulo = document.getElementById('titulo').value;
        const preco = document.getElementById('preco').value;
        const imagem_url = document.getElementById('imagem_url').value;
        const descricao = document.getElementById('descricao').value;

        const dadosPost = { titulo, preco, imagem_url, descricao };
        const metodo = id ? 'PUT' : 'POST';
        const url = id ? `${API_BASE}/publicacoes/${id}` : `${API_BASE}/publicacoes`;

        try {
            const resposta = await fetch(url, {
                method: metodo,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dadosPost)
            });

            const resultado = await resposta.json();

            if (resposta.ok) {
                alert(resultado.mensagem);
                fecharModalPost();
                carregarPublicacoes();
            } else {
                alert(resultado.erro || 'Erro ao guardar publicação.');
            }
        } catch (erro) {
            console.error('Erro:', erro);
        }
    });
}

function prepararEdicao(id, titulo, preco, imagem_url, descricao) {
    document.getElementById('post-id').value = id;
    document.getElementById('titulo').value = titulo;
    document.getElementById('preco').value = preco;
    document.getElementById('imagem_url').value = imagem_url;
    document.getElementById('descricao').value = descricao;

    document.getElementById('form-title').innerText = 'Editar Publicação';
    document.getElementById('btn-submit').innerText = 'Guardar Alterações';
    
    abrirModalPost();
}

function limparFormularioPost() {
    document.getElementById('post-id').value = '';
    formPublicacao.reset();
    document.getElementById('form-title').innerText = 'Nova Publicação';
    document.getElementById('btn-submit').innerText = 'Publicar no Feed';
}

async function apagarPublicacao(id) {
    if (!confirm('Tens a certeza que queres apagar esta publicação?')) return;

    try {
        const resposta = await fetch(`${API_BASE}/publicacoes/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const resultado = await resposta.json();
        if (resposta.ok) {
            alert(resultado.mensagem);
            carregarPublicacoes();
        } else {
            alert(resultado.erro || 'Erro ao apagar.');
        }
    } catch (erro) {
        console.error('Erro:', erro);
    }
}

// 5. Pesquisa em Tempo Real
if (inputPesquisa) {
    inputPesquisa.addEventListener('input', (e) => {
        const termo = e.target.value.toLowerCase();
        const filtradas = listaPublicacoesGlobal.filter(post => 
            post.titulo.toLowerCase().includes(termo) ||
            (post.descricao || '').toLowerCase().includes(termo) ||
            (post.nome_trabalhador || '').toLowerCase().includes(termo)
        );
        renderizarFeed(filtradas);
    });
}
function atualizarInterfaceUsuario() {
    if (usuarioLogado && token) {
        userArea.innerHTML = `
            <div class="user-profile-card">
                <div class="user-info">
                    <span class="user-name">${usuarioLogado.nome}</span>
                    <span class="user-badge">${usuarioLogado.tipo_usuario}</span>
                </div>
                <button class="btn-logout" onclick="fazerLogout()">Sair</button>
            </div>
        `;

        if (usuarioLogado.tipo_usuario === 'trabalhador') {
            btnAbrirModal.classList.remove('hidden');
        } else {
            btnAbrirModal.classList.add('hidden');
        }
    } else {
        btnAbrirModal.classList.add('hidden');
        userArea.innerHTML = `<a href="login.html" class="btn-login-link">Entrar / Registar</a>`;
    }
}