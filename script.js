let cameraAtual = "user"; // Inicia com a câmera frontal
let fotoBase64 = "";
let streamAtual;

// Função para iniciar a câmera
function iniciarCamera() {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: cameraAtual } })
        .then(stream => {
            streamAtual = stream;
            document.getElementById("video").srcObject = stream;
        })
        .catch(error => {
            console.error("Erro ao acessar a câmera:", error);
        });
}

// Função para alternar entre a câmera frontal e traseira
function alternarCamera() {
    // Interrompe o stream atual
    if (streamAtual) {
        streamAtual.getTracks().forEach(track => track.stop());
    }
    // Alterna entre as câmeras
    cameraAtual = cameraAtual === "user" ? "environment" : "user";
    iniciarCamera();
}

// Função para capturar a foto
function tirarFoto() {
    let video = document.getElementById("video");
    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");

    // Ajusta o canvas para o tamanho do vídeo
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Converte a imagem do canvas para Base64
    fotoBase64 = canvas.toDataURL("image/png");
    alert("Foto capturada com sucesso!");
}

// Função para cadastrar pessoa
function cadastrarPessoa() {
    let cpf = document.getElementById("cpf").value;
    let nome = document.getElementById("nome").value;
    let idade = document.getElementById("idade").value;
    let endereco = document.getElementById("endereco").value;
    let telefone = document.getElementById("telefone").value;
    let email = document.getElementById("email").value;

    if (cpf && nome && idade && endereco && telefone && email && fotoBase64) {
        let pessoa = {
            cpf, nome: nome,
            idade: idade,
            endereco: endereco,
            telefone: telefone,
            email: email,
            foto: fotoBase64
        };
        localStorage.setItem(cpf, JSON.stringify(pessoa));
        alert("Pessoa cadastrada com sucesso!");

        // Limpa os campos
        document.getElementById("cpf").value = '';
        document.getElementById("nome").value = '';
        document.getElementById("idade").value = '';
        document.getElementById("endereco").value = '';
        document.getElementById("telefone").value = '';
        document.getElementById("email").value = '';
        fotoBase64 = '';
    } else {
        alert("Por favor, preencha todos os campos e tire uma foto.");
    }
}

// Função para consultar pessoa
function consultarPessoa() {
    let cpfConsulta = document.getElementById("cpfConsulta").value;
    let pessoa = localStorage.getItem(cpfConsulta);

    if (pessoa) {
        pessoa = JSON.parse(pessoa);

        document.getElementById("info").innerHTML = `
            Nome: ${pessoa.nome}<br>
            Idade: ${pessoa.idade}<br>
            Endereço: ${pessoa.endereco}<br>
            Telefone: ${pessoa.telefone}<br>
            Email: ${pessoa.email}
        `;

        let foto = document.getElementById("foto");
        foto.src = pessoa.foto;
        foto.style.display = "block";
    } else {
        document.getElementById("info").innerText = "CPF não encontrado.";
        document.getElementById("foto").style.display = "none";
    }
}

// Inicia a câmera ao carregar a página
iniciarCamera();
