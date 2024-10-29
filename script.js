let fotoBase64 = '';
let streamAtual = null;
let usandoCameraFrontal = true;

function abrirCamera() {
    const video = document.getElementById("camera");
    video.style.display = "block";
    iniciarCamera();
}

function iniciarCamera() {
    const video = document.getElementById("camera");

    // Define a preferência de câmera: frontal ou traseira
    const constraints = {
        video: {
            facingMode: usandoCameraFrontal ? "user" : "environment"
        }
    };

    // Interrompe qualquer stream de câmera ativo antes de iniciar um novo
    if (streamAtual) {
        streamAtual.getTracks().forEach(track => track.stop());
    }

    navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
            streamAtual = stream;
            video.srcObject = stream;
        })
        .catch(error => {
            console.error("Erro ao acessar a câmera:", error);
            alert("Não foi possível acessar a câmera.");
        });
}

function alternarCamera() {
    usandoCameraFrontal = !usandoCameraFrontal;
    iniciarCamera();
}

function capturarFoto() {
    const video = document.getElementById("camera");
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    fotoBase64 = canvas.toDataURL("image/png");

    if (streamAtual) {
        streamAtual.getTracks().forEach(track => track.stop());
    }
    video.style.display = "none";
    alert("Foto capturada com sucesso!");
}

function cadastrarPessoa() {
    let cpf = document.getElementById("cpf").value;
    let nome = document.getElementById("nome").value;

    if (cpf && nome && fotoBase64) {
        localStorage.setItem(cpf, JSON.stringify({ nome: nome, foto: fotoBase64 }));
        alert("Pessoa cadastrada com sucesso!");

        document.getElementById("cpf").value = '';
        document.getElementById("nome").value = '';
        fotoBase64 = '';
    } else {
        alert("Por favor, preencha todos os campos e capture uma foto.");
    }
}

function consultarPessoa() {
    let cpfConsulta = document.getElementById("cpfConsulta").value;
    let dados = localStorage.getItem(cpfConsulta);

    if (dados) {
        const pessoa = JSON.parse(dados);
        document.getElementById("info").innerText = `Nome: ${pessoa.nome}`;
        
        const img = document.getElementById("fotoConsultada");
        img.src = pessoa.foto;
        img.style.display = "block";
    } else {
        document.getElementById("info").innerText = "CPF não encontrado.";
        document.getElementById("fotoConsultada").style.display = "none";
    }
}

function gerarPDF() {
    let cpfConsulta = document.getElementById("cpfConsulta").value;
    let dados = localStorage.getItem(cpfConsulta);

    if (dados) {
        const { nome, foto } = JSON.parse(dados);
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();

        pdf.text(`Nome: ${nome}`, 10, 20);
        pdf.addImage(foto, "PNG", 10, 30, 50, 50);
        pdf.save(`${nome}_dados.pdf`);
    } else {
        alert("CPF não encontrado. Por favor, consulte uma pessoa antes de gerar o PDF.");
    }
}

