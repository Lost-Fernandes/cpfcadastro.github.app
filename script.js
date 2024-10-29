// Função para cadastrar pessoa
let fotoBase64 = '';

        function abrirCamera() {
            const video = document.getElementById("camera");
            video.style.display = "block";

            // Acessa a câmera do dispositivo
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(stream => {
                    video.srcObject = stream;
                })
                .catch(error => {
                    console.error("Erro ao acessar a câmera:", error);
                    alert("Não foi possível acessar a câmera.");
                });
        }

        function capturarFoto() {
            const video = document.getElementById("camera");
            const canvas = document.getElementById("canvas");
            const context = canvas.getContext("2d");

            // Desenha a imagem do vídeo no canvas
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // Converte a imagem para Base64
            fotoBase64 = canvas.toDataURL("image/png");

            // Pausa o vídeo e oculta a câmera
            video.srcObject.getTracks().forEach(track => track.stop());
            video.style.display = "none";
            alert("Foto capturada com sucesso!");
        }

        function cadastrarPessoa() {
            let cpf = document.getElementById("cpf").value;
            let nome = document.getElementById("nome").value;

            if (cpf && nome && fotoBase64) {
                // Armazena o nome e a foto no localStorage usando o CPF como chave
                localStorage.setItem(cpf, JSON.stringify({ nome: nome, foto: fotoBase64 }));
                alert("Pessoa cadastrada com sucesso!");
                
                // Limpa os campos
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
                
                // Exibe a foto
                const img = document.getElementById("fotoConsultada");
                img.src = pessoa.foto;
                img.style.display = "block";
            } else {
                document.getElementById("info").innerText = "CPF não encontrado.";
                document.getElementById("fotoConsultada").style.display = "none";
            }
        }
