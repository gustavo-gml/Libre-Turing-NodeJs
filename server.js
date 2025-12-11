const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

// --- CONFIGURAÇÕES ---
app.use(cors());
app.use(express.json()); // Permite ler JSON vindo do frontend
app.use(express.static('public')); // Serve seus arquivos HTML/CSS/JS antigos

// --- CONEXÃO COM O BANCO DE DADOS ---
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // No XAMPP a senha padrão é vazia
    database: 'libre_turing'
});

db.connect(err => {
    if (err) {
        console.error('Erro ao conectar no MySQL:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL: libre_turing');
});


// --- ROTA DE LOGIN ---
app.post('/api/login', (req, res) => {
    const { cpf, senha } = req.body;

    // Remove pontos e traços do CPF para comparar com o banco 
    const cpfLimpo = cpf.replace(/[^\d]/g, ''); 
   
    
    // Query para buscar usuario
    const sql = 'SELECT * FROM funcionarios WHERE cpf = ? AND senha = ?';

    db.query(sql, [cpf, senha], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erro no servidor' });
        }

        if (results.length > 0) {
            // Usuário encontrado!
            res.json({ 
                success: true, 
                message: 'Login realizado!', 
                usuario: results[0].nome_funcionario // Devolvemos o nome para usar se quiser
            });
        } else {
            // Usuário não encontrado ou senha errada
            res.status(401).json({ success: false, message: 'CPF ou senha incorretos' });
        }
    });
});

// --- ROTA PARA CADASTRAR EXEMPLARES (ACERVO) ---
app.post('/api/exemplares', (req, res) => {
    // Recebemos o ID do Livro (FK), Código de Barras e Data
    const { id_livro, codigo_de_barras, data_aquisicao } = req.body;

    // O status padrão ao cadastrar é "Disponível"
    const status = "Disponível"; 

    const sql = `INSERT INTO exemplares (id_livro, codigo_de_barras, data_aquisicao, status) 
                 VALUES (?, ?, ?, ?)`;

    db.query(sql, [id_livro, codigo_de_barras, data_aquisicao, status], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao salvar exemplar.' });
        }
        res.json({ message: 'Exemplar cadastrado com sucesso!', id: result.insertId });
    });
});

// --- ATUALIZAR LIVRO (PUT) ---
app.put('/api/livros/:id', (req, res) => {
    const { id } = req.params;
    const { titulo, isbn, categoria, autor, ano } = req.body;

    const sql = `UPDATE livros SET titulo = ?, isbn = ?, categoria = ?, autor = ?, ano = ? WHERE id = ?`;

    db.query(sql, [titulo, isbn, categoria, autor, ano, id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Livro atualizado com sucesso!' });
    });
});

// --- EXCLUIR LIVRO (DELETE) ---
app.delete('/api/livros/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM livros WHERE id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Livro excluído!' });
    });
});

// =========================================================
// ROTAS (ENDPOINTS)
// =========================================================

// --- 1. TABELA ALUNOS (Exemplo simples) ---

// Consultar todos os alunos
app.get('/api/alunos', (req, res) => {
    db.query('SELECT * FROM alunos', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// Cadastrar novo aluno
app.post('/api/alunos', (req, res) => {
    // Pegando os dados que vieram do Frontend
    const { ra, nome_aluno, cpf, data_nasc, curso, email, telefone } = req.body;
    
    const sql = `INSERT INTO alunos (ra, nome_aluno, cpf, data_nasc, curso, email, telefone) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [ra, nome_aluno, cpf, data_nasc, curso, email, telefone], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Aluno cadastrado com sucesso!', id: result.insertId });
    });
});


// --- 2. TABELA LIVROS ---

app.get('/api/livros', (req, res) => {
    db.query('SELECT * FROM livros', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

app.post('/api/livros', (req, res) => {
    const { isbn, titulo, autor, categoria, ano } = req.body;
    const sql = 'INSERT INTO livros (isbn, titulo, autor, categoria, ano) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [isbn, titulo, autor, categoria, ano], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Livro salvo!', id: result.insertId });
    });
});


// --- 3. TABELA EMPRÉSTIMOS (O "Pulo do Gato" - Com Chaves Estrangeiras) ---
// Aqui cumprimos o requisito de consulta com tabelas relacionadas

app.get('/api/emprestimos', (req, res) => {
    // Note o INNER JOIN. Isso traz o NOME do aluno e do funcionário em vez de só o ID
    const sql = `
        SELECT 
            e.id, 
            e.data_emprestimo, 
            e.data_prevista_devolucao,
            ex.codigo_de_barras,
            a.nome_aluno,
            f.nome_funcionario
        FROM emprestimos e
        INNER JOIN exemplares ex ON e.id_exemplar = ex.id
        INNER JOIN alunos a ON e.ra_aluno = a.ra
        INNER JOIN funcionarios f ON e.id_funcionario = f.id
    `;

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

app.post('/api/emprestimos', (req, res) => {
    const { id_exemplar, id_funcionario, ra_aluno, data_emprestimo, data_prevista_devolucao } = req.body;
    
    const sql = `INSERT INTO emprestimos (id_exemplar, id_funcionario, ra_aluno, data_emprestimo, data_prevista_devolucao) 
                 VALUES (?, ?, ?, ?, ?)`;

    db.query(sql, [id_exemplar, id_funcionario, ra_aluno, data_emprestimo, data_prevista_devolucao], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Empréstimo realizado!', id: result.insertId });
    });
});

// --- INICIAR SERVIDOR ---
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});