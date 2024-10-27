let cameraAtual = "user";
let fotoBase64 = "";
let streamAtual;

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

function alternarCamera() {
    if (streamAtual) {
        streamAtual.getTracks().forEach(track => track.stop());
    }
    cameraAtual = cameraAtual === "user" ? "environment" : "user";
    iniciarCamera();
}

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
        gerarPDF(cpf, pessoa);
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

        document.getElementById("downloadPdfBtn").style.display = "inline";
        document.getElementById("deletarBtn").style.display = "inline";
    } else {
        alert("CPF não encontrado.");
    }
}

function gerarPDF(cpf, pessoa) {
    const { jsPDF } = window.jspdf;
    let doc = new jsPDF();

    doc.text(`CPF: ${cpf}`, 10, 10);
    doc.text(`Nome: ${pessoa.nome}`, 10, 20);
    doc.text(`Idade: ${pessoa.idade}`, 10, 30);
    doc.text(`Endereço: ${pessoa.endereco}`, 10, 40);
    doc.text(`Telefone: ${pessoa.telefone}`, 10, 50);
    doc.text(`Email: ${pessoa.email}`, 10, 60);

    if (pessoa.foto) {
        doc.addImage(pessoa.foto, "PNG", 10, 70, 50, 50);
    }

    // Salva o PDF em base64 no localStorage
    let pdfBase64 = doc.output("datauristring");
    localStorage.setItem(`pdf_${cpf}`, pdfBase64);
}

function downloadPDF() {
    let cpfConsulta = document.getElementById("cpfConsulta").value;
    let pdfBase64 = localStorage.getItem(`pdf_${cpfConsulta}`);

    if (pdfBase64) {
        let link = document.createElement("a");
        link.href = pdfBase64;
        link.download = `Cadastro_${cpfConsulta}.pdf`;
        link.click();
    } else {
        alert("PDF não encontrado para este CPF.");
    }
}

function deletarPessoa() {
    let cpfConsulta = document.getElementById("cpfConsulta").value;
    localStorage.removeItem(cpfConsulta);
    localStorage.removeItem(`pdf_${cpfConsulta}`);
    alert("Cadastro deletado com sucesso.");
    document.getElementById("info").innerHTML = "";
    document.getElementById("foto").style.display = "none";
    document.getElementById("downloadPdfBtn").style.display = "none";
    document.getElementById("deletarBtn").style.display = "none";
}
