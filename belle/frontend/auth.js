const API_BASE = 'http://localhost:3000/api/auth';

const tabLogin = document.getElementById('tab-login');
const tabRegister = document.getElementById('tab-register');
const formLogin = document.getElementById('form-login');
const formRegister = document.getElementById('form-register');

// Alternar entre abas de Login e Registo
function mudarAba(tipo) {
    if (tipo === 'login') {
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
        formLogin.classList.remove('hidden');
        formRegister.classList.add('hidden');
    } else {
        tabRegister.classList.add('active');
        tabLogin.classList.remove('active');
        formRegister.classList.remove('hidden');
        formLogin.classList.add('hidden');
    }
}

// Submeter Registo
formRegister.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nome = document.getElementById('reg-nome').value;
    const email = document.getElementById('reg-email').value;
    const senha = document.getElementById('reg-senha').value;
    const tipo_usuario = document.getElementById('reg-tipo').value;

    try {
        const resposta = await fetch(`${API_BASE}/registrar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, senha, tipo_usuario })
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            alert('Conta criada com sucesso! Podes fazer login agora.');
            formRegister.reset();
            mudarAba('login');
        } else {
            alert(dados.erro || 'Erro ao criar conta.');
        }
    } catch (erro) {
        console.error('Erro:', erro);
        alert('Erro ao ligar ao servidor.');
    }
});

// Submeter Login
formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const senha = document.getElementById('login-senha').value;

    try {
        const resposta = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            localStorage.setItem('token', dados.token);
            localStorage.setItem('usuario', JSON.stringify(dados.usuario));
            alert(`Bem-vinda de volta, ${dados.usuario.nome}!`);
            window.location.href = 'index.html'; // Redireciona para o Feed
        } else {
            alert(dados.erro || 'Erro ao fazer login.');
        }
    } catch (erro) {
        console.error('Erro:', erro);
        alert('Erro ao ligar ao servidor.');
    }
});