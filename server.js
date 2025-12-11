const express = require('express');
const cors = require('cors');

require('dotenv').config();
const app = express();

// =========================================================
// 1. CONFIGURAÇÕES INICIAIS
// =========================================================
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// =========================================================
// 2. CONEXÃO COM BANCO DE DADOS
// =========================================================
const db = require('./src/config/db');


// =========================================================
// 3. ROTA DE AUTENTICAÇÃO (LOGIN)
// =========================================================
app.post('/api/login', (req, res) => {
    const { cpf, senha } = req.body;
    const sql = 'SELECT * FROM funcionarios WHERE cpf = ? AND senha = ?';

    db.query(sql, [cpf, senha], (err, results) => {
        if (err) return res.status(500).json({ error: 'Erro no servidor' });
        if (results.length > 0) {
            res.json({ success: true, message: 'Login realizado!', usuario: results[0].nome_funcionario });
        } else {
            res.status(401).json({ success: false, message: 'CPF ou senha incorretos' });
        }
    });
});

// =========================================================
// 4. ROTAS DE ALUNOS
// =========================================================
app.get('/api/alunos', (req, res) => {
    db.query('SELECT * FROM alunos', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// =========================================================
// 5. ROTAS DE LIVROS (TÍTULOS) - CRUD COMPLETO
// =========================================================

// Listar Livros
app.get('/api/livros', (req, res) => {
    db.query('SELECT * FROM livros', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// Cadastrar Livro
app.post('/api/livros', (req, res) => {
    const { isbn, titulo, autor, categoria, ano } = req.body;
    const sql = 'INSERT INTO livros (isbn, titulo, autor, categoria, ano) VALUES (?, ?, ?, ?, ?)';
    
    db.query(sql, [isbn, titulo, autor, categoria, ano], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Livro salvo!', id: result.insertId });
    });
});

// Atualizar Livro
app.put('/api/livros/:id', (req, res) => {
    const { id } = req.params;
    const { titulo, isbn, categoria, autor, ano } = req.body;
    const sql = `UPDATE livros SET titulo = ?, isbn = ?, categoria = ?, autor = ?, ano = ? WHERE id = ?`;

    db.query(sql, [titulo, isbn, categoria, autor, ano, id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Livro atualizado com sucesso!' });
    });
});

// Excluir Livro (Cascata: Empréstimos -> Exemplares -> Livro)
app.delete('/api/livros/:id', (req, res) => {
    const { id } = req.params;

    // 1. Apagar histórico de empréstimos vinculados aos exemplares deste livro
    const sqlDeleteEmprestimos = `
        DELETE e FROM emprestimos e
        INNER JOIN exemplares ex ON e.id_exemplar = ex.id
        WHERE ex.id_livro = ?
    `;

    db.query(sqlDeleteEmprestimos, [id], (err) => {
        if (err) {
            console.error("Erro ao limpar histórico:", err);
            return res.status(500).json({ error: 'Erro ao limpar histórico de empréstimos.' });
        }

        // 2. Apagar os exemplares físicos
        const sqlDeleteExemplares = 'DELETE FROM exemplares WHERE id_livro = ?';
        db.query(sqlDeleteExemplares, [id], (err2) => {
            if (err2) return res.status(500).json({ error: 'Erro ao apagar exemplares.' });

            // 3. Finalmente, apagar o título
            const sqlDeleteLivro = 'DELETE FROM livros WHERE id = ?';
            db.query(sqlDeleteLivro, [id], (err3) => {
                if (err3) return res.status(500).json({ error: 'Erro ao excluir o livro.' });
                res.json({ message: 'Livro e dados vinculados excluídos!' });
            });
        });
    });
});

// =========================================================
// 6. ROTAS DE ACERVO (EXEMPLARES FÍSICOS)
// =========================================================
app.get('/api/acervo', (req, res) => {
    // AQUI: Mudamos para a view nova que criamos para o Node
    const sql = 'SELECT * FROM view_acervo_node'; 
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Erro ao buscar acervo:", err);
            return res.status(500).json({ error: 'Erro ao buscar dados.' });
        }
        res.json(results);
    });
});

app.post('/api/exemplares', (req, res) => {
    const { id_livro, codigo_de_barras, data_aquisicao } = req.body;
    const status = "Disponível"; 
    const sql = `INSERT INTO exemplares (id_livro, codigo_de_barras, data_aquisicao, status) VALUES (?, ?, ?, ?)`;

    db.query(sql, [id_livro, codigo_de_barras, data_aquisicao, status], (err, result) => {
        if (err) return res.status(500).json({ error: 'Erro ao salvar exemplar.' });
        res.json({ message: 'Exemplar cadastrado com sucesso!', id: result.insertId });
    });
});

app.put('/api/acervo/:id', (req, res) => {
    const { id } = req.params;
   
    const { codigo_barras, data_aquisicao, status } = req.body; 
    
    
    const sql = 'UPDATE exemplares SET codigo_de_barras = ?, data_aquisicao = ?, status = ? WHERE id = ?';

    db.query(sql, [codigo_barras, data_aquisicao, status, id], (err, result) => {
        if (err) {
            console.error("Erro ao atualizar:", err);
            return res.status(500).json(err);
        }
        res.json({ message: 'Exemplar atualizado!' });
    });
});

// =========================================================
// ROTA DE EXCLUSÃO DE ACERVO (COM REMOÇÃO DE HISTÓRICO)
// =========================================================
app.delete('/api/acervo/:id', (req, res) => {
    const { id } = req.params;

    // 1. PASSO IMPORTANTE: Apagar todos os empréstimos vinculados a este exemplar
    const sqlDeleteEmprestimos = 'DELETE FROM emprestimos WHERE id_exemplar = ?';

    db.query(sqlDeleteEmprestimos, [id], (err) => {
        if (err) {
            console.error("Erro ao limpar histórico de empréstimos:", err);
            // Se der erro aqui, paramos e avisamos o front-end
            return res.status(500).json({ error: 'Erro ao limpar histórico. O exemplar não foi apagado.' });
        }

        // 2. AGORA SIM: Como não tem mais histórico, podemos apagar o exemplar
        const sqlDeleteExemplar = 'DELETE FROM exemplares WHERE id = ?';
        
        db.query(sqlDeleteExemplar, [id], (err2) => {
            if (err2) {
                console.error("Erro ao excluir exemplar:", err2);
                return res.status(500).json({ error: 'Erro ao excluir o exemplar físico.' });
            }

            // Sucesso total
            res.json({ message: 'Exemplar e seu histórico de empréstimos foram excluídos!' });
        });
    });
});

// =========================================================
// 7. ROTAS DE EMPRÉSTIMOS E DEVOLUÇÕES
// =========================================================

// LISTAR
app.get('/api/emprestimos', (req, res) => {
    const sql = `
        SELECT 
            e.id, 
            e.data_emprestimo, 
            e.data_prevista_devolucao,
            e.data_devolucao,
            IF(e.data_devolucao IS NULL, 'Ativo', 'Devolvido') as status,
            a.nome_aluno,
            l.titulo AS nome_livro,
            ex.codigo_de_barras
        FROM emprestimos e
        INNER JOIN alunos a ON e.ra_aluno = a.ra
        INNER JOIN exemplares ex ON e.id_exemplar = ex.id
        INNER JOIN livros l ON ex.id_livro = l.id
        ORDER BY status ASC, e.data_prevista_devolucao ASC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Erro GET Emprestimos:", err);
            return res.status(500).json({ error: 'Erro ao buscar empréstimos: ' + err.message });
        }
        res.json(results);
    });
});

// EMPRESTAR
app.post('/api/emprestimos', (req, res) => {
    const { id_exemplar, id_funcionario, ra_aluno, data_emprestimo, data_prevista_devolucao } = req.body;
    
    const sqlInsert = `INSERT INTO emprestimos (id_exemplar, id_funcionario, ra_aluno, data_emprestimo, data_prevista_devolucao) 
                       VALUES (?, ?, ?, ?, ?)`;

    db.query(sqlInsert, [id_exemplar, id_funcionario, ra_aluno, data_emprestimo, data_prevista_devolucao], (err, result) => {
        if (err) {
            console.error("Erro SQL INSERT:", err);
            return res.status(500).json({ error: err.message });
        }

        const sqlUpdateExemplar = "UPDATE exemplares SET status = 'Emprestado' WHERE id = ?";
        db.query(sqlUpdateExemplar, [id_exemplar], (errUpdate) => {
            if (errUpdate) console.error("Erro ao atualizar livro:", errUpdate);
            res.json({ message: 'Empréstimo realizado e livro atualizado!' });
        });
    });
});

// DEVOLVER
app.put('/api/emprestimos/:id/devolver', (req, res) => {
    const { id } = req.params;
    const dataHoje = new Date().toISOString().split('T')[0];

    const sqlGet = 'SELECT id_exemplar FROM emprestimos WHERE id = ?';

    db.query(sqlGet, [id], (err, results) => {
        if (err || results.length === 0) return res.status(500).json({ error: 'Empréstimo não encontrado' });
        
        const idExemplar = results[0].id_exemplar;

        const sqlUpdateEmp = 'UPDATE emprestimos SET data_devolucao = ? WHERE id = ?';
        
        db.query(sqlUpdateEmp, [dataHoje, id], (err) => {
            if (err) return res.status(500).json(err);

            const sqlUpdateEx = "UPDATE exemplares SET status = 'Disponível' WHERE id = ?";
            db.query(sqlUpdateEx, [idExemplar], (err) => {
                if (err) return res.status(500).json(err);
                res.json({ message: 'Devolução realizada!' });
            });
        });
    });
});

// EXCLUIR EMPRÉSTIMO
app.delete('/api/emprestimos/:id', (req, res) => {
    const { id } = req.params;

    const sqlCheck = 'SELECT id_exemplar, data_devolucao FROM emprestimos WHERE id = ?';

    db.query(sqlCheck, [id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Erro ao verificar' });
        if (results.length === 0) return res.status(404).json({ error: 'Não encontrado' });

        const emp = results[0];

        if (emp.data_devolucao === null) {
            const sqlLibera = "UPDATE exemplares SET status = 'Disponível' WHERE id = ?";
            db.query(sqlLibera, [emp.id_exemplar], () => {
                deletarRegistro(id, res);
            });
        } else {
            deletarRegistro(id, res);
        }
    });
});

function deletarRegistro(id, res) {
    const sql = 'DELETE FROM emprestimos WHERE id = ?';
    db.query(sql, [id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Registro excluído!' });
    });
}

// =========================================================
// 8. ROTA DE RELATÓRIO (CORRIGIDA)
// =========================================================
app.get('/api/relatorio-acervo', (req, res) => {
    // A query SQL permanece a mesma
    const sql = `
        SELECT 
            l.titulo, 
            COUNT(e.id) as total_exemplares,
            (COUNT(e.id) - COUNT(emp.id)) as disponiveis
        FROM livros l
        LEFT JOIN exemplares e ON l.id = e.id_livro
        LEFT JOIN emprestimos emp ON e.id = emp.id_exemplar AND emp.data_devolucao IS NULL
        GROUP BY l.id, l.titulo
        ORDER BY disponiveis ASC, l.titulo ASC
    `;

    // Usando a variável 'db' que você já criou lá em cima e callbacks
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Erro no relatório:", err);
            return res.status(500).json({ erro: "Erro ao buscar relatório" });
        }
        
        // Envia os resultados (results) direto para o front
        res.json(results);
    });
});

// =========================================================
// 9. INICIAR SERVIDOR
// =========================================================
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});