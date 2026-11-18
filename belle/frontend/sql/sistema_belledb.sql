CREATE DATABASE IF NOT EXISTS sistema_belle;
USE sistema_belle;

-- 1. Criar primeiro a tabela de Utilizadores (com a coluna foto_perfil já integrada)
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    tipo_usuario ENUM('consumidor', 'trabalhador') NOT NULL DEFAULT 'consumidor',
    foto_perfil VARCHAR(255),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir utilizador de teste com senha criptografada em bcrypt (ex: hash para "123456")
-- e definindo explicitamente o tipo_usuario para evitar conflitos.
INSERT INTO usuarios (id, nome, email, senha, tipo_usuario) 
VALUES (
    3, 
    'Utilizador Teste', 
    'teste@sistema.com', 
    '$2b$10$On17CdtNcmMT3xTj/27fQu4rxjU8BXJw/D0J/gjjoeStKiqPlh.RS', 
    'trabalhador'
)
ON DUPLICATE KEY UPDATE
    nome = 'Utilizador Teste',
    senha = VALUES(senha),
    tipo_usuario = 'trabalhador';

-- 2. Tabela de Publicações (para os trabalhadores divulgarem comidas, artesanatos, etc.)
CREATE TABLE IF NOT EXISTS publicacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10, 2),
    imagem_url VARCHAR(255),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- 3. Tabela de Comentários
CREATE TABLE IF NOT EXISTS comentarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    publicacao_id INT NOT NULL,
    usuario_id INT NOT NULL,
    texto TEXT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (publicacao_id) REFERENCES publicacoes(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);