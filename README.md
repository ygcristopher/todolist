# Sprin List Application

Este repositório contém a implementação de um **aplicativo de lista de tarefas (Todo List)**, que inclui tanto a **API** quanto o **Frontend**. A arquitetura do projeto é um **mono repo**, com a API e o Frontend no mesmo repositório, cada um com seu próprio diretório.

## Estrutura do Projeto

- **api/**: Contém a API responsável pela lógica do backend e manipulação de dados.
- **front/**: Contém o frontend do aplicativo, com a interface de usuário.

## Visão Geral

O projeto foi desenvolvido para permitir que os usuários façam login, cadastrem-se e gerenciem suas listas de tarefas. Ele utiliza tecnologias modernas para garantir que a aplicação seja escalável, rápida e fácil de manter.

- **Backend (API)**: Desenvolvido com Node.js e TypeScript, usando Express para a construção da API.
- **Frontend (UI)**: Desenvolvido com Next.js e React, oferecendo uma interface interativa e responsiva.
  
A comunicação entre o frontend e o backend é feita por meio de uma API RESTful, que utiliza JWT para autenticação e controle de sessão.

---

## Tecnologias Utilizadas

### Backend

- **Node.js**: Ambiente de execução para JavaScript no servidor.
- **TypeScript**: Superset do JavaScript com tipagem estática.
- **Express**: Framework web para Node.js.
- **Knex.js**: Biblioteca SQL para consultas ao banco de dados.
- **JWT (JSON Web Tokens)**: Para autenticação e autorização.
- **Bcryptjs**: Para criptografar senhas.
- **MySQL**: Banco de dados relacional.
  
### Frontend

- **React**: Biblioteca JavaScript para construção de interfaces de usuário.
- **Next.js**: Framework para React, com suporte a SSR (Server-Side Rendering) e SSG (Static Site Generation).
- **Tailwind CSS**: Framework utilitário para criação de layouts responsivos.
- **Zod**: Validação de dados no frontend.
- **Axios**: Cliente HTTP para realizar requisições à API.
- **JWT Decode**: Para decodificar tokens JWT no frontend.
- **Radix UI**: Componentes acessíveis para construção de interfaces de usuário.

---

## Instalação

### Requisitos

- **Node.js** (versão >= v18.19.0)
- **NPM** ou **Yarn**
- **Docker** (para rodar o banco de dados MySQL localmente)

### Passos para Instalar

1. **Clone este repositório:**

   ```bash
   git clone https://github.com/ygcristopher/todolist
   cd todolist

## Configuração da API

1. **Acesse o diretório da API:**

   ```bash
   cd api
2. **Instale as dependências:**
   ```bash
   npm install
3. **Execute o servidor:**
   ```bash
   nodemon index

## Configuração do Frontend

1. **Acesse o diretório do frontend:**
   ```bash
   cd front
2. **Instale as dependências:**
   ```bash
   npm install
3. **Execute o servidor:**
   ```bash
   npm run dev

## Configuração do Banco de Dados com Docker
**Para rodar o banco de dados MySQL localmente usando Docker, siga os passos abaixo:**

1. **Certifique-se de ter o Docker Desktop instalado.**
2. **No diretório raiz do projeto:** você encontrará um arquivo docker-compose.yml. Este arquivo configura o MySQL para ser executado em um contêiner Docker.
3. **Para subir o banco de dados MySQL, execute:**
   ```bash
   docker-compose up -d

## Restaurando o Banco de Dados com o Backup
**Caso deseje restaurar o banco de dados a partir do backup fornecido, siga estas etapas:**

1. **O arquivo de backup api_mysql_data_backup.tar.gz está localizado na pasta db-backup/. Certifique-se de que o arquivo esteja no local correto.**
2. **Copie o arquivo de backup para dentro do contêiner MySQL:**
   ```bash
   docker cp ./db-backup/api_mysql_data_backup.tar.gz nome_do_container_mysql:/var/lib/mysql
3. **Nota:** Troque nome_do_container_mysql pelo nome real do contêiner MySQL. Você pode descobrir o nome com o comando docker ps.
4. **Entre no contêiner MySQL**
   ```bash
   docker exec -it nome_do_container_mysql bash
5. **Acesse o diretório do MySQL dentro do contêiner:**
   ```bash
   cd /var/lib/mysql
6. **Extraia o backup:**
   ```bash
   tar -xvzf api_mysql_data_backup.tar.gz

### Verificação
Após restaurar o banco de dados, acesse a API e verifique se as tabelas e os dados estão corretamente configurados.