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
    if (streamAtual) {
        streamAtual.getTracks().forEach(track => track.stop());
    }
    cameraAtual = cameraAtual === "user" ? "environment" : "user";
    iniciarCamera();
}

// Função para capturar a foto
function tirarFoto() {
    let video = document.getElementById("video");
    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

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
            nome: nome,
            idade: idade,
            endereco: endereco,
            telefone: telefone,
            email: email,
            foto: fotoBase64
        };
        localStorage.setItem(cpf, JSON.stringify(pessoa));
        alert("Pessoa cadastrada com sucesso!");
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

        document.getElementById("gerarPdfBtn").style.display = "inline";
        document.getElementById("deletarBtn").style.display = "inline";
    } else {
        document.getElementById("info").innerText = "CPF não encontrado.";
        document.getElementById("foto").style.display = "none";
        document.getElementById("gerarPdfBtn").style.display = "none";
        document.getElementById("deletarBtn").style.display = "none";
    }
}

// Função para gerar PDF com os dados da pessoa consultada
function gerarPDF() {
    let cpfConsulta = document.getElementById("cpfConsulta").value;
    let pessoa = JSON.parse(localStorage.getItem(cpfConsulta));

    if (pessoa) {
        const { jsPDF } = window.jspdf;
        let doc = new jsPDF();
        
        doc.text(`CPF: ${cpfConsulta}`, 10, 10);
        doc.text(`Nome: ${pessoa.nome}`, 10, 20);
        doc.text(`Idade: ${pessoa.idade}`, 10, 30);
        doc.text(`Endereço: ${pessoa.endereco}`, 10, 40);
        doc.text(`Telefone: ${pessoa.telefone}`, 10, 50);
        doc.text(`Email: ${pessoa.email}`, 10, 60);

        if (pessoa.foto) {
            doc.addImage(pessoa.foto, "PNG", 10, 70, 50, 50);
        }

        doc.save(`Cadastro_${cpfConsulta}.pdf`);
    } else {
        alert("Dados não encontrados para gerar PDF.");
    }
}

// Função para deletar pessoa do localStorage
function deletarPessoa() {
    let cpfConsulta = document.getElementById("cpfConsulta").value;
    localStorage.removeItem(cpfConsulta);
    alert("Cadastro deletado com sucesso.");
    document.getElementById("info").innerHTML = "";
    document.getElementById("foto").style.display = "none";
    document.getElementById("gerarPdfBtn").style.display = "none";
    document.getElementById("deletarBtn").style.display = "none";
}
