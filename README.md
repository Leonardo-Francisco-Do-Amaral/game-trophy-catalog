# 🎮 Catálogo de Jogos e Platinas

![Status do Projeto](https://img.shields.io/badge/status-em_desenvolvimento-yellow)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Material-UI](https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=mui&logoColor=white)

Aplicação web full-stack desenvolvida para gerenciar uma coleção pessoal de jogos, com foco no rastreamento de troféus, platinas, notas e estatísticas detalhadas.

---

## ✨ Funcionalidades Principais

O projeto é dividido em um frontend interativo e um backend robusto que se comunicam para oferecer uma experiência completa de catalogação.

### Frontend (React)

* **Dashboard Visual:** Apresenta estatísticas gerais como total de jogos, platinas, progresso geral e tempo médio para platinar.
* **Listagem Dinâmica:** Visualize a coleção de jogos em formato de grid (cards) ou lista (tabela).
* **Busca e Filtragem:** Pesquise jogos por nome e filtre por status (Platinado, Em Progresso, etc.).
* **Ordenação:** Organize a lista por colocação, nome, nota ou progresso.
* **Modal de Detalhes:** Veja informações completas de um jogo, incluindo notas, linha do tempo e tags.
* **Cadastro Inteligente:**
    * **Busca por API:** Integração com a API da [RAWG.io](https://rawg.io/) para buscar e preencher dados de jogos automaticamente.
    * **Cadastro Manual:** Permite a inserção de todos os dados manualmente para controle total.
    * **Formulário Completo:** Campos detalhados para notas, tempo jogado, status da platina, datas e muito mais.
* **Edição de Jogos:** Funcionalidade completa para atualizar qualquer informação de um jogo já cadastrado.

### Backend (Node.js & Express)

* **API RESTful:** Endpoints seguros para criar, ler, atualizar e deletar (CRUD) informações dos jogos.
* **Banco de Dados Relacional:** Utiliza PostgreSQL para garantir a integridade e o relacionamento dos dados.
* **Transações Seguras:** Todas as operações de escrita no banco (criação e atualização) são feitas usando transações (`BEGIN`, `COMMIT`, `ROLLBACK`) para garantir que os dados nunca fiquem em um estado inconsistente.
* **Busca de Imagens:** Função auxiliar que busca imagens de capa na API da RAWG, tratando diferentes variações de nomes para melhorar a taxa de sucesso.

---

## 🛠️ Tecnologias Utilizadas

* **Frontend:**
    * [**React**](https://react.dev/): Biblioteca para construção da interface de usuário.
    * [**Material-UI (MUI)**](https://mui.com/): Suíte de componentes UI para um design rápido e consistente.
* **Backend:**
    * [**Node.js**](https://nodejs.org/): Ambiente de execução JavaScript no servidor.
    * [**Express.js**](https://expressjs.com/): Framework para construção da API.
    * [**PostgreSQL**](https://www.postgresql.org/): Sistema de gerenciamento de banco de dados relacional.
    * **CORS:** Para permitir a comunicação entre o frontend e o backend.
    * **Dotenv:** Para gerenciamento de variáveis de ambiente.
* **API Externa:**
    * [**RAWG API**](https://rawg.io/apidocs): Para busca de informações e imagens de jogos.

---

## 🚀 Como Executar o Projeto

Para rodar este projeto localmente, você precisará ter o Node.js e o PostgreSQL instalados.

### 1. Preparação do Banco de Dados

1.  Crie um banco de dados no PostgreSQL.
2.  Execute o script SQL abaixo para criar as tabelas necessárias:

```sql
-- (COLOQUE AQUI O SEU SCRIPT SQL PARA CRIAR AS TABELAS 'jogos' e 'configuracoes_usuario_jogo')
-- Exemplo:
CREATE TABLE jogos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    -- ... resto das colunas
);

CREATE TABLE configuracoes_usuario_jogo (
    id SERIAL PRIMARY KEY,
    jogo_id INTEGER REFERENCES jogos(id),
    -- ... resto das colunas
);
```

### 2. Configuração do Backend

```bash
# Clone o repositório
git clone SUA_URL_DO_REPOSITORIO_AQUI.git
cd catalogo-jogos-react-node/backend

# Instale as dependências
npm install

# Crie um arquivo .env na raiz da pasta 'backend'
# e preencha com suas credenciais do banco e a chave da API RAWG
# Use o arquivo .env.example como modelo:
```

Crie o arquivo `backend/.env.example` (e adicione-o ao git) com este conteúdo:
```
# Configurações do Banco de Dados PostgreSQL
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=nome_do_seu_banco

# Porta do Servidor
PORT=3001
```
E diga ao usuário para renomeá-lo para `.env` e preenchê-lo.

```bash
# Inicie o servidor backend
npm start
```

### 3. Configuração do Frontend

```bash
# Em um novo terminal, navegue para a pasta do frontend
cd ../frontend

# Instale as dependências
npm install

# Inicie a aplicação React
npm start
```

A aplicação React estará rodando em `http://localhost:3000` e se conectará ao backend em `http://localhost:3001`.

---

## 🖼️ Telas do Projeto

**(Recomendação: Tire prints das suas telas principais e coloque aqui!)**

*Ex: Tela de Listagem, Tela de Cadastro, Dashboard de Estatísticas*

![image](URL_DA_SUA_IMAGEM_AQUI)
![image](URL_DA_SUA_IMAGEM_AQUI)

---

## 🗺️ Roadmap e Planos Futuros

* [ ] **Integração com Power BI:** Exportar os dados para criar dashboards e relatórios avançados.
* [ ] **Autenticação de Usuário:** Permitir que múltiplos usuários tenham suas próprias coleções.
* [ ] **Sistema de "Backlog":** Adicionar uma área para jogos que desejo jogar no futuro.
* [ ] **Melhorar a Responsividade:** Otimizar a visualização em dispositivos móveis.