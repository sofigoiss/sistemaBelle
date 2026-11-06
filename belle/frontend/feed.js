document.addEventListener('DOMContentLoaded', () => {
    carregarPublicacoes();

    const dados = {
    titulo: tituloInput.value,
    preco: precoInput.value,
    imagem_url: imagemInput.value,
    descricao: descricaoInput.value,
    usuario_id: 1
};

    // Captura o formulário de publicação (ajusta o ID se necessário no teu HTML)
    const formPublicacao = document.getElementById('formPublicacao') || document.querySelector('form');
    if (formPublicacao) {
        formPublicacao.addEventListener('submit', criarPublicacao);
    }
});

// Função para buscar e exibir todas as publicações no feed
async function carregarPublicacoes() {
    try {
        const resposta = await fetch('http://localhost:3000/api/publicacoes');
        if (!resposta.ok) throw new Error('Erro ao carregar publicações');
        
        const publicacoes = await resposta.json();
        const containerFeed = document.getElementById('feedContainer') || document.querySelector('.feed-container');
        
        if (!containerFeed) return;
        
        containerFeed.innerHTML = '';
        
        if (publicacoes.length === 0) {
            containerFeed.innerHTML = '<p>Ainda não há publicações. Sê o primeiro a publicar! 🌸</p>';
            return;
        }

        publicacoes.forEach(pub => {
            const card = document.createElement('div');
            card.className = 'card-publicacao';
            card.innerHTML = `
                <h3>${pub.titulo}</h3>
                <p class="preco">R$ ${pub.preco}</p>
                ${pub.imagem_url ? `<img src="${pub.imagem_url}" alt="${pub.titulo}" style="max-width:100%; border-radius:8px; margin-top:10px;">` : ''}
                <p style="margin-top: 10px;">${pub.descricao}</p>
                <small style="color: #666; display: block; margin-top: 10px;">Por: ${pub.nome || 'Utilizador'}</small>
            `;
            containerFeed.appendChild(card);
        });
    } catch (erro) {
        console.error('Erro:', erro);
        const containerFeed = document.getElementById('feedContainer') || document.querySelector('.feed-container');
        if (containerFeed) {
            containerFeed.innerHTML = '<p>Erro ao carregar as publicações.</p>';
        }
    }
}

// Função para criar uma nova publicação sem exigir token
async function criarPublicacao(e) {
    e.preventDefault();

    const tituloInput = document.getElementById('titulo') || document.querySelector('input[name="titulo"]');
    const precoInput = document.getElementById('preco') || document.querySelector('input[name="preco"]');
    const imagemInput = document.getElementById('imagem_url') || document.querySelector('input[name="imagem_url"]');
    const descricaoInput = document.getElementById('descricao') || document.querySelector('textarea[name="descricao"]');

    const dados = {
        titulo: tituloInput ? tituloInput.value : '',
        preco: precoInput ? precoInput.value : 0,
        imagem_url: imagemInput ? imagemInput.value : '',
        descricao: descricaoInput ? descricaoInput.value : '',
        usuario_id: 1 // ID estático para testes livres sem dependência de login
    };

    try {
        const resposta = await fetch('http://localhost:3000/api/publicacoes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                // Sem cabeçalho de Authorization para evitar bloqueios de token
            },
            body: JSON.stringify(dados)
        });

        const resultado = await resposta.json();

        if (resposta.ok) {
            alert('Publicação criada com sucesso! 🌸');
            location.reload(); // Recarrega a página para atualizar o feed
        } else {
            alert(resultado.erro || 'Erro ao criar publicação.');
        }
    } catch (erro) {
        console.error('Erro na requisição:', erro);
        alert('Erro de conexão com o servidor.');
    }
}
// Função para apagar publicação
async function apagarPublicacao(id) {
    if (!confirm('Tens a certeza de que queres apagar esta publicação?')) return;

    try {
        const resposta = await fetch(`http://localhost:3000/api/publicacoes/${id}`, {
            method: 'DELETE'
        });

        const resultado = await resposta.json();

        if (resposta.ok) {
            alert(resultado.mensagem);
            location.reload(); // Recarrega o feed para atualizar a lista
        } else {
            alert(resultado.erro || 'Erro ao apagar a publicação.');
        }
    } catch (erro) {
        console.error('Erro ao apagar:', erro);
        alert('Erro ao conectar com o servidor.');
    }
}

// Função para atualizar publicação (exemplo com prompt rápido ou modal)
async function editarPublicacao(id, tituloAtual, precoAtual, descricaoAtual, imagemAtual) {
    const novoTitulo = prompt('Novo título:', tituloAtual);
    if (novoTitulo === null) return; // Cancelou

    const novoPreco = prompt('Novo preço:', precoAtual);
    const novaDescricao = prompt('Nova descrição:', descricaoAtual);
    const novaImagem = prompt('Nova URL da Imagem:', imagemAtual);

    try {
        const resposta = await fetch(`http://localhost:3000/api/publicacoes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                titulo: novoTitulo,
                preco: novoPreco,
                descricao: novaDescricao,
                imagem_url: novaImagem
            })
        });

        const resultado = await resposta.json();

        if (resposta.ok) {
            alert(resultado.mensagem);
            location.reload();
        } else {
            alert(resultado.erro || 'Erro ao atualizar a publicação.');
        }
    } catch (erro) {
        console.error('Erro ao atualizar:', erro);
        alert('Erro ao conectar com o servidor.');
    }
}