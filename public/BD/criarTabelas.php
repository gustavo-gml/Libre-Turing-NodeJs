<?php
$servidor = 'localhost';
$usuario = 'root';
$senha = '';
$banco = 'libre_turing';

try 
{
    $dsn = "mysql:host=$servidor;dbname=$banco;charset=utf8"; 
    $conexao = new PDO($dsn, $usuario, $senha);
    $conexao->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 1. Tabela de Logs
    $sql = "
    CREATE TABLE IF NOT EXISTS livros_apagados_log (
        id INT AUTO_INCREMENT PRIMARY KEY,
        livro_id INT NOT NULL,
        isbn CHAR(13),
        titulo VARCHAR(150) NOT NULL,
        autor VARCHAR(100),
        categoria VARCHAR(100) NOT NULL ,
        ano SMALLINT,
        data_remocao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    ";
    $conexao->exec($sql);
    echo "Tabela 'livros_apagados_log' criada com sucesso (ou já existia).<br>";
    
    // 2. Tabela de Livros
    $sql = "
    CREATE TABLE IF NOT EXISTS livros(
        id INT AUTO_INCREMENT PRIMARY KEY,
 	    isbn CHAR(13) UNIQUE, 
 	    titulo VARCHAR(150) NOT NULL,
 	    autor VARCHAR(100),
        categoria VARCHAR(100) NOT NULL ,
        ano SMALLINT,
        INDEX idx_titulo (titulo)
    );
    ";
    $conexao->exec($sql);
    echo "Tabela 'livros' criada com sucesso (ou já existia).<br>";

    // 3. Tabela de Exemplares
    $sql = "
     CREATE TABLE IF NOT EXISTS exemplares (
        id INT AUTO_INCREMENT PRIMARY KEY,
        codigo_de_barras VARCHAR(50) NOT NULL UNIQUE, 
        isbn INT NOT NULL,
        status ENUM('Disponível', 'Emprestado', 'Manutenção', 'Perdido') NOT NULL DEFAULT 'Disponível',
        data_aquisicao DATE,
        FOREIGN KEY (isbn) REFERENCES livros(isbn)
    );
    ";
    $conexao->exec($sql);
    echo "Tabela 'exemplares' criada com sucesso (ou já existia).<br>";

    // 4. Tabela de Funcionários
    $sql = "
     CREATE TABLE IF NOT EXISTS funcionarios(
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome_funcionario  VARCHAR(100) NOT NULL,
        cpf CHAR(11) NOT NULL UNIQUE,
        data_nasc DATE NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        telefone VARCHAR(15),
        endereco VARCHAR(60) NOT NULL,
        senha VARCHAR(255) NOT NULL UNIQUE
    );
    ";
    $conexao->exec($sql);
    echo "Tabela 'funcionarios' criada com sucesso (ou já existia).<br>";

    // 5. Tabela de Alunos
    $sql = "
     CREATE TABLE IF NOT EXISTS alunos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ra CHAR(11) NOT NULL UNIQUE,
        nome_aluno VARCHAR(100) NOT NULL,
        cpf CHAR(11) NOT NULL UNIQUE,
        data_nasc DATE NOT NULL,
        curso VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        telefone VARCHAR(15),
        INDEX idx_nome_aluno (nome_aluno)
    );
    ";
    $conexao->exec($sql);
    echo "Tabela 'alunos' criada com sucesso (ou já existia).<br>";

    // 6. Tabela de Empréstimos
    $sql = "
     CREATE TABLE IF NOT EXISTS emprestimos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        id_exemplar INT NOT NULL,
        id_funcionario INT NOT NULL,
        ra_aluno CHAR(11) NOT NULL,

        data_emprestimo DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        data_prevista_devolucao DATE NOT NULL,
        data_devolucao DATETIME,

        FOREIGN KEY (id_exemplar) REFERENCES exemplares(id),
        FOREIGN KEY (id_funcionario) REFERENCES funcionarios(id),
        FOREIGN KEY (ra_aluno) REFERENCES alunos(ra)
    );
    ";
    $conexao->exec($sql);
    echo "Tabela 'emprestimos' criada com sucesso (ou já existia).<br>";

    // 7. Trigger de Log
    $conexao->exec("DROP TRIGGER IF EXISTS tr_livros_before_delete;");

    $sql_trigger = "
    CREATE TRIGGER tr_livros_before_delete
    BEFORE DELETE ON livros
    FOR EACH ROW
    BEGIN
        INSERT INTO livros_apagados_log (livro_id, isbn, titulo, autor, categoria, ano)
        VALUES (OLD.id, OLD.isbn, OLD.titulo, OLD.autor, OLD.categoria, OLD.ano);
    END;
    ";
    $conexao->exec($sql_trigger);
    echo "Trigger 'tr_livros_before_delete' criado com sucesso.<br>";

    // 8. VIEW ESPECIAL PARA O NODE.JS (COM LÓGICA DE STATUS)
    $sql_view = "
    CREATE OR REPLACE VIEW view_acervo_node AS
    SELECT 
        e.id AS id_exemplar,
        e.codigo_de_barras,
        e.data_aquisicao,
        l.titulo AS nome_livro,
        l.isbn,
        CASE 
            WHEN e.status = 'Perdido' THEN 'Perdido'
            WHEN e.status = 'Manutenção' THEN 'Manutenção'
            WHEN EXISTS (
                SELECT 1 FROM emprestimos emp 
                WHERE emp.id_exemplar = e.id AND emp.data_devolucao IS NULL
            ) THEN 'Emprestado'
            ELSE 'Disponível'
        END AS status
    FROM exemplares e
    JOIN livros l ON e.id_livro = l.id;
    ";
    $conexao->exec($sql_view);
    echo "View 'view_acervo_node' criada com sucesso!<br>";

} catch (PDOException $e) {
    echo "Erro ao criar tabelas/views: " . $e->getMessage();
}
?>