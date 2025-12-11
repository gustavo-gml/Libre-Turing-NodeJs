# 📚 Libre Turing - Sistema de Gerenciamento de Biblioteca

> Projeto acadêmico desenvolvido para a disciplina de Tecnologias de Desenvolvimento para a Internet II.

Este projeto consiste em um sistema web completo para gerenciamento de acervo bibliotecário, permitindo o controle de livros, exemplares físicos, empréstimos, devoluções e relatórios de disponibilidade. O sistema utiliza **JavaScript no Back-End** com **Node.js**, seguindo os padrões abordados em sala de aula.

---

## 🏫 Sobre o Projeto

Este software foi desenvolvido como requisito avaliativo do curso de **Sistemas de Informação** do **IFSULDEMINAS - Campus Machado**.

* **Disciplina:** Tecnologias de Desenvolvimento para a Internet II
* **Professor:** Matheus Guedes Vilas Boas 
* **Semestre:** 2025

### 👥 Equipe de Desenvolvimento

* Agabo Monteiro
* Gustavo Martins
* José Gabriel
* Tiago Lemes

---

## 🚀 Tecnologias Utilizadas

O projeto foi construído utilizando a seguinte pilha de tecnologias, conforme estudado no módulo de Node.js:

* **Back-End:** Node.js (Ambiente de execução JavaScript no servidor) 
* **Framework Web:** Express.js (Facilita criação de servidores e rotas) 
* **Banco de Dados:** MySQL
* **Driver de Conexão:** mysql2
* **Segurança/Config:** dotenv (Gerenciamento de variáveis de ambiente) 
* **Front-End:** HTML5, CSS3 e JavaScript (Vanilla)

---

## ⚙️ Funcionalidades

* **Autenticação:** Login de funcionários.
* **Gestão de Livros:** Cadastro, edição e remoção de títulos bibliográficos.
* **Gestão de Acervo (Exemplares):**
    * Controle individual por código de barras.
    * Status dinâmico (*Disponível, Emprestado, Manutenção, Perdido*).
* **Fluxo de Empréstimos:**
    * Realização de empréstimos vinculados a alunos e funcionários.
    * Devolução com atualização automática de status.
    * Integridade Referencial: Bloqueio/Cascata na exclusão de exemplares com histórico.
* **Relatórios:** Visualização rápida da disponibilidade do acervo e livros esgotados.

---

## 📦 Como Rodar o Projeto

### Pré-requisitos
Antes de começar, certifique-se de ter instalado em sua máquina:
* [Node.js](https://nodejs.org/) 
* [MySQL Server](https://dev.mysql.com/downloads/)

### Passo a Passo

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/gustavo-gml/Libre-Turing-NodeJs.git
    cd libre-turing
    ```

2.  **Instale as dependências:**
    Execute o comando abaixo para instalar as bibliotecas necessárias (`express`, `mysql2`, `dotenv`, etc.):
    ```bash
    npm install
    ```

3.  **Configure o Banco de Dados:**
    * Certifique-se de que o serviço MySQL está rodando.
    * Execute o script `criarBD.php` para gerar o banco.
    * Execute o script `criarTabelas.php` para gerar as tabelas e a view `view_acervo_node`.

4.  **Configure as Variáveis de Ambiente:**
    * Crie um arquivo `.env` na raiz do projeto (baseado nas boas práticas de segurança).
    * Preencha com suas credenciais:
    ```env
    DB_HOST=localhost
    DB_USER=root
    DB_PASS=
    DB_NAME=libre_turing
    PORT=3000
    ```

5.  **Inicie o Servidor:**
    Para rodar a aplicação, utilize o comando:
    ```bash
    node server.js
    ```
    *Você verá a mensagem: `🚀 Servidor rodando em http://localhost:3000`*

6.  **Acesse:**
    Abra o navegador e vá para `http://localhost:3000`.

---

## 📂 Estrutura do Projeto


libre-turing/
├── public/               # Arquivos estáticos (HTML, CSS, JS do Front)
├── src/
│   └── config/           # Configuração de Banco de Dados (db.js)
├── BD/
│   └── criarBD.php       # Script auxiliar de banco
│   └── criarTabelas.php  # Script auxiliar de tabelas
├── .env                  # Variáveis de ambiente (Segurança)
├── server.js             # Servidor e Rotas da API 
└── package.json          # Dependências do projeto


---

## 📝 Licença

Este projeto está liberado para modificação e uso para fins acadêmicos e educacionais.

---
*Desenvolvido com 💚 pela equipe Libre Turing - IFSULDEMINAS.*