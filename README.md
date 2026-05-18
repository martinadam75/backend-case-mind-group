# TechBlog API - Backend

Esta é a API REST robusta que suporta o ecossistema do TechBlog. Desenvolvida em Node.js com TypeScript, utiliza o Express como framework de roteamento e interage diretamente com um banco de dados relacional MySQL.

## Tecnologias e Arquitetura

* **Node.js & TypeScript:** Tipagem estrita e escalabilidade no ecossistema do servidor.
* **Express:** Roteamento ágil e interceptação por middlewares estruturados.
* **MySQL (pool de conexões):** Camada de persistência relacional otimizada.
* **JWT (JsonWebToken):** Autenticação stateless segura para endpoints protegidos.
* **BCrypt:** Criptografia de via única (hashing) para proteção de senhas.

## Pré-requisitos

* Node.js (v18 ou superior)
* Docker & Docker Compose (para orquestração rápida do banco de dados)

## Configuração e Inicialização

1. **Instalar as dependências:**
    ```bash
    npm install

2. **Configurar as variáveis de ambiente:**
Crie um arquivo .env na raiz do projeto com base nas seguintes chaves:
    ```bash
    PORT=3333
    DB_HOST=localhost
    DB_USER=root
    DB_PASS=
    DB_NAME=mind_db
    JWT_SECRET=seu_token_secreto_super_seguro

3. **Iniciar o banco de dados MySQL (via Docker):**
    ```bash
    docker-compose up -d


4. **Injetar a estrutura e dados iniciais (Seed):**
Execute o script de dump para criar as tabelas e popular o banco com os artigos de exemplo:

    ```bash
    docker exec -i mysql-mind mysql -u root mind_db < dump.sql

5. **Iniciar o servidor (Modo de Desenvolvimento):**

    ```bash
    npm run dev

A API estará rodando em http://localhost:3333

## Principais Endpoints da API

Autenticação (/api/auth)
- POST /register - Registro de novas contas.
- POST /login - Autenticação de usuários (Retorna o JWT).
- GET /profile - Busca de dados do perfil atual (Requer Token).
- PUT /profile - Atualização de dados e foto de perfil (Requer Token).

Artigos (/api/articles)
- GET / - Listagem completa de artigos com dados dos autores.

- POST / - Criação de novos artigos (Requer Token).

- PUT /:id - Atualização de um artigo específico (Requer Token).

- DELETE /:id - Exclusão de um artigo (Requer Token).

- GET /:id/comments - Retorna os comentários de um artigo.

- POST /:id/comments - Adiciona um comentário a um artigo (Requer Token).