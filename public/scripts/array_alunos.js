function carregarDadosCompletos() {
      const dadosJSON = localStorage.getItem("dados");
      return JSON.parse(dadosJSON || '{"livros": [], "alunos": []}');
    }

    /**
     * Salva o objeto de dados completo no localStorage.
     * @param {object} dadosParaSalvar - O objeto contendo as listas de livros e alunos.
     */
    function salvarDadosCompletos(dadosParaSalvar) {
      localStorage.setItem("dados", JSON.stringify(dadosParaSalvar));
    }


    // --- SCRIPT DE INICIALIZAÇÃO DOS ALUNOS (com a lista completa) ---

    /**
     * Verifica se a base de alunos precisa ser populada e a preenche se necessário.
     */
    function inicializarBaseDeAlunos() {
      const listaAlunos = [
        { ra: '20251940018', nome: 'AGABO DI WALNER SOARES MONTEIRO', cpf: '11122233301', dataNascimento: '2005-04-10', curso: 'Sistemas de Informação', email: 'agabo_nao_acabo@gmail.com', telefone: '(35) 98877-1122' },
        { ra: '20251940014', nome: 'ALEXANDRE COSTA PENHA DA SILVA', cpf: '11122233302', dataNascimento: '2006-08-20', curso: 'Sistemas de Informação', email: 'xandao_da_penha@outlook.com', telefone: '(35) 99988-2233' },
        { ra: '20251940011', nome: 'ANE CAROLINE SIQUEIRA MACIEL', cpf: '11122233303', dataNascimento: '2004-01-15', curso: 'Sistemas de Informação', email: 'ane_nao_a_ana@yahoo.com', telefone: '(35) 91122-3344' },
        { ra: '20251940004', nome: 'ARTHUR SERAPIAO BERALDO', cpf: '11122233304', dataNascimento: '2005-11-01', curso: 'Sistemas de Informação', email: 'rei_arthur_de_beraldo@hotmail.com', telefone: '(35) 98877-4455' },
        { ra: '20251940038', nome: 'BIANCA SERAFIM BERALDO', cpf: '11122233305', dataNascimento: '2006-03-25', curso: 'Sistemas de Informação', email: 'bibi_perigosa@gmail.com', telefone: null },
        { ra: '20251940028', nome: 'BRENO HENRIQUE DOS SANTOS MARTINS', cpf: '11122233306', dataNascimento: '2004-07-19', curso: 'Sistemas de Informação', email: 'breno_o_terrivel@bol.com.br', telefone: '(35) 91234-5678' },
        { ra: '20251940040', nome: 'BRUNO MENDES FERNANDES', cpf: '11122233307', dataNascimento: '2005-09-09', curso: 'Sistemas de Informação', email: 'bruno_nao_o_mars@gmail.com', telefone: '(35) 98765-4321' },
        { ra: '20251940026', nome: 'EDSON RIBEIRO JUNIOR', cpf: '22233344401', dataNascimento: '2005-02-14', curso: 'Sistemas de Informação', email: 'edinho_iluminado@gmail.com', telefone: '(35) 91111-2222' },
        { ra: '20251940016', nome: 'EMANUEL PEREIRA BRITO', cpf: '22233344402', dataNascimento: '2006-10-30', curso: 'Sistemas de Informação', email: 'manu_o_deus_conosco@hotmail.com', telefone: '(35) 93333-4444' },
        { ra: '20251940012', nome: 'FELIPPE GIORDANY DE OLIVEIRA', cpf: '22233344403', dataNascimento: '2004-05-05', curso: 'Sistemas de Informação', email: 'felippe_com_dois_p@uol.com.br', telefone: '(35) 95555-6666' },
        { ra: '20251940010', nome: 'GABRIEL FELIPE DE SOUZA LUZ', cpf: '22233344404', dataNascimento: '2005-12-24', curso: 'Sistemas de Informação', email: 'gabriel_anjo_da_luz@gmail.com', telefone: null },
        { ra: '20251940001', nome: 'GUSTAVO MARTINS DE LIMA', cpf: '22233344405', dataNascimento: '2006-06-16', curso: 'Sistemas de Informação', email: 'gugu_de_lima_a_fruta@gmail.com', telefone: '(35) 97777-8888' },
        { ra: '20251940015', nome: 'GUSTAVO TEODORO DA COSTA', cpf: '22233344406', dataNascimento: '2004-09-21', curso: 'Sistemas de Informação', email: 'teodoro_da_costa_rica@yahoo.com', telefone: '(35) 99999-0000' },
        { ra: '20251940009', nome: 'HALLISON JANUARIO MARTINS MARIA', cpf: '22233344407', dataNascimento: '2005-01-01', curso: 'Sistemas de Informação', email: 'hallison_em_janeiro@gmail.com', telefone: '(35) 91010-2020' },
        { ra: '20251940034', nome: 'HUDSON MAURO LOPES FILHO', cpf: '33344455501', dataNascimento: '2005-08-11', curso: 'Sistemas de Informação', email: 'filho_do_hudson_mauro@hotmail.com', telefone: '(35) 93030-4040' },
        { ra: '20251940025', nome: 'JEAN CARLOS SANTOS SILVA', cpf: '33344455502', dataNascimento: '2006-02-02', curso: 'Sistemas de Informação', email: 'jean_claude_van_damme_cover@gmail.com', telefone: null },
        { ra: '20251940019', nome: 'JOAO EDUARDO ALVES SILVA', cpf: '33344455503', dataNascimento: '2004-11-12', curso: 'Sistemas de Informação', email: 'dudu_alves_o_rei_do_pop@gmail.com', telefone: '(35) 95050-6060' },
        { ra: '20251940022', nome: 'JONATHAS DE OLIVEIRA AGUIAR', cpf: '33344455504', dataNascimento: '2005-03-03', curso: 'Sistemas de Informação', email: 'jonathas_o_profeta@yahoo.com', telefone: '(35) 97070-8080' },
        { ra: '20251940020', nome: 'JOSE GABRIEL REIS DA CRUZ', cpf: '33344455505', dataNascimento: '2006-07-27', curso: 'Sistemas de Informação', email: 'jose_dos_reis_magos@gmail.com', telefone: '(35) 99090-1010' },
        { ra: '20251940027', nome: 'JUAN PABLO ARAUJO FARIAS', cpf: '33344455506', dataNascimento: '2004-12-31', curso: 'Sistemas de Informação', email: 'juan_pablo_o_papa_dev@hotmail.com', telefone: '(35) 91212-3434' },
        { ra: '20251940037', nome: 'KAIANE DOS SANTOS NERY', cpf: '33344455507', dataNascimento: '2005-05-18', curso: 'Sistemas de Informação', email: 'kaiane_poderosa@gmail.com', telefone: null },
        { ra: '20251940041', nome: 'KATLYN PEREIRA', cpf: '44455566601', dataNascimento: '2006-09-01', curso: 'Sistemas de Informação', email: 'katlyn_a_gata@uol.com.br', telefone: '(35) 93434-5656' },
        { ra: '20251940032', nome: 'LAERCIO ANTONIO DA LUZ FILHO', cpf: '44455566602', dataNascimento: '2004-03-17', curso: 'Sistemas de Informação', email: 'laercio_iluminado_jr@gmail.com', telefone: '(35) 97878-9090' },
        { ra: '20251940002', nome: 'LANNA DOMINGUES DANTAS', cpf: '44455566603', dataNascimento: '2005-10-10', curso: 'Sistemas de Informação', email: 'lannister_de_dantas@yahoo.com', telefone: '(35) 91122-1122' },
        { ra: '20251940042', nome: 'LEONARDO DE LIMA CAMARGO', cpf: '44455566604', dataNascimento: '2006-04-14', curso: 'Sistemas de Informação', email: 'leo_da_vinci_camargo@gmail.com', telefone: null },
        { ra: '20251940030', nome: 'LETHYCYA CARVALHO CAPRONI', cpf: '44455566605', dataNascimento: '2004-08-08', curso: 'Sistemas de Informação', email: 'lethycia_com_y@hotmail.com', telefone: '(35) 93344-5566' },
        { ra: '20251940043', nome: 'LUAN VITOR SANTOS DE PAULA', cpf: '44455566606', dataNascimento: '2005-02-28', curso: 'Sistemas de Informação', email: 'luan_gameplays@gmail.com', telefone: '(35) 97788-9900' },
        { ra: '20251940008', nome: 'LUCAS FELIPE DE SOUZA FARIAS', cpf: '44455566607', dataNascimento: '2006-11-11', curso: 'Sistemas de Informação', email: 'lucas_o_sortudo@uol.com.br', telefone: '(35) 91231-2312' },
        { ra: '20251940013', nome: 'MARIA CLARA PEREIRA GONÇALVES', cpf: '55566677701', dataNascimento: '2005-06-24', curso: 'Sistemas de Informação', email: 'maria_das_claras@gmail.com', telefone: '(35) 93434-3434' },
        { ra: '20251940033', nome: 'MIGUEL DE OLIVEIRA MELLO', cpf: '55566677702', dataNascimento: '2004-10-02', curso: 'Sistemas de Informação', email: 'miguel_arcanjo_de_mello@yahoo.com', telefone: null },
        { ra: '20251940036', nome: 'PABLO RUAN OLIVEIRA CHAGAS', cpf: '55566677703', dataNascimento: '2006-01-20', curso: 'Sistemas de Informação', email: 'pablo_escobar_das_chagas@gmail.com', telefone: '(35) 95656-5656' },
        { ra: '20251940003', nome: 'RUAN PABLO VIANA DOS SANTOS', cpf: '55566677704', dataNascimento: '2005-07-07', curso: 'Sistemas de Informação', email: 'ruan_so_que_sem_p@hotmail.com', telefone: '(35) 97878-7878' },
        { ra: '20251940029', nome: 'SAULO FERREIRA DOS SANTOS', cpf: '55566677705', dataNascimento: '2004-04-04', curso: 'Sistemas de Informação', email: 'saulo_o_perseguidor@bol.com.br', telefone: '(35) 99090-9090' },
        { ra: '20251940005', nome: 'THALIA MARTINS', cpf: '55566677706', dataNascimento: '2006-08-18', curso: 'Sistemas de Informação', email: 'thalia_a_usurpadora@gmail.com', telefone: null },
        { ra: '20251940044', nome: 'TIAGO LEMES DA CRUZ', cpf: '55566677707', dataNascimento: '2005-12-12', curso: 'Sistemas de Informação', email: 'tiago_da_santa_cruz@yahoo.com', telefone: '(35) 91313-1313' },
        { ra: '20251940045', nome: 'TOBIAS SILVA PEREIRA', cpf: '66677788801', dataNascimento: '2004-06-06', curso: 'Sistemas de Informação', email: 'tobias_o_gato_de_botas@gmail.com', telefone: '(35) 95454-5454' },
        { ra: '20251940024', nome: 'VICTOR HUGO CAPRONI SILVA COSTA', cpf: '66677788802', dataNascimento: '2006-03-13', curso: 'Sistemas de Informação', email: 'victor_hugo_os_miseraveis@hotmail.com', telefone: '(35) 92424-2424' }
      ];

      const dadosAtuais = carregarDadosCompletos();

      if (!dadosAtuais.alunos || dadosAtuais.alunos.length === 0) {
        console.log("Base de alunos não encontrada. Inicializando com a lista completa...");
        dadosAtuais.alunos = listaAlunos;
        salvarDadosCompletos(dadosAtuais);
        console.log("Base de alunos inicializada com sucesso!");
      } else {
        console.log("Base de alunos já existe. Nenhuma ação necessária.");
      }
    }

    // --- EXECUÇÃO ---
    inicializarBaseDeAlunos();