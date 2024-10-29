// Função para cadastrar pessoa
function cadastrarPessoa() {
    let cpf = document.getElementById("cpf").value;
    let nome = document.getElementById("nome").value;

    if (cpf && nome) {
        // Armazena o nome no localStorage usando o CPF como chave
        localStorage.setItem(cpf, nome);
        alert("Pessoa cadastrada com sucesso!");
        
        // Limpa os campos
        document.getElementById("cpf").value = '';
        document.getElementById("nome").value = '';
    } else {
        alert("Por favor, preencha todos os campos.");
    }
}

// Função para consultar pessoa
function consultarPessoa() {
    let cpfConsulta = document.getElementById("cpfConsulta").value;
    let nome = localStorage.getItem(cpfConsulta);

    if (nome) {
        document.getElementById("info").innerText = `Nome: ${nome}`;
    } else {
        document.getElementById("info").innerText = "CPF não encontrado.";
    }
}
