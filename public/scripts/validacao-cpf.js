function validaCPF(cpf) {
    // 1. Limpa a formatação (pontos e hífen)
    const cpfLimpo = cpf.replace(/[^\d]/g, '');

    // 2. Verifica se tem 11 dígitos
    if (cpfLimpo.length !== 11) {
        return false;
    }

    // 3. Verifica se todos os dígitos são iguais (ex: 111.111.111-11)
    if (/^(\d)\1{10}$/.test(cpfLimpo)) {
        return false;
    }

    // 4. Validação dos dígitos verificadores
    let soma = 0;
    let resto;

    // --- Validação do primeiro dígito verificador ---
    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpfLimpo.substring(i - 1, i)) * (11 - i);
    }
    resto = (soma * 10) % 11;

    if ((resto === 10) || (resto === 11)) {
        resto = 0;
    }

    if (resto !== parseInt(cpfLimpo.substring(9, 10))) {
        return false;
    }

    // --- Validação do segundo dígito verificador ---
    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpfLimpo.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;

    if ((resto === 10) || (resto === 11)) {
        resto = 0;
    }

    if (resto !== parseInt(cpfLimpo.substring(10, 11))) {
        return false;
    }

    // Se passou por todas as verificações, o CPF é válido
    return true;
}
            const formLogin = document.getElementById('form-login');
            const cpfInput = document.getElementById('cpf');
            const senhaInput = document.getElementById('senha'); // Adicionado
            const cpfError = document.getElementById('cpf-error');

            formLogin.addEventListener('submit', function(event) {
    // SEMPRE previne o envio padrão do formulário HTML
    event.preventDefault();

    const cpfValue = cpfInput.value;
    const senhaValue = senhaInput.value;

    // 1. Validação Matemática do CPF (Seu código original)
    if (!validaCPF(cpfValue)) {
        cpfError.textContent = 'CPF inválido. Por favor, digite um CPF existente.';
        cpfInput.style.borderColor = 'red';
        return; // Para a execução aqui
    }

    // 2. Se o CPF é válido matematicamente, limpa erros visuais
    cpfError.textContent = '';
    cpfInput.style.borderColor = '';

    // 3. AGORA verificamos no Backend (Banco de Dados)
    console.log("Enviando dados para o servidor...");

    const dadosLogin = {
        cpf: cpfValue,
        senha: senhaValue
    };

    fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosLogin)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // SUCESSO: Redireciona para o menu
            console.log('Login aprovado:', data.message);
            window.location.href = 'pages/menu.html'; 
            // Certifique-se que a pasta 'pages' está dentro de 'public'
        } else {
            // ERRO: Senha errada ou usuário não cadastrado
            cpfError.textContent = 'Usuário não encontrado ou senha incorreta.';
            cpfInput.style.borderColor = 'red';
        }
    })
    .catch(error => {
        console.error('Erro na requisição:', error);
        alert('Erro ao conectar com o servidor. O Node está rodando?');
    });
});