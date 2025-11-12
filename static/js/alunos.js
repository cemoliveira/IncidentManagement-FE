document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");
  const usuario = localStorage.getItem("usuario");

  if (!token) {
    window.location.href = "/index.html?error=unauthorized";
    return;
  }

  const usuarioLogado = document.getElementById("usuario-logado");
  if (usuarioLogado) usuarioLogado.textContent = usuario || "Usuário";

  const btnHome = document.getElementById("btn-home");
  if (btnHome) {
    btnHome.addEventListener("click", () => {
      window.location.href = "home.html";
    });
  }

  const btnLogout = document.getElementById("btn-logout");
  if (btnLogout) {
    btnLogout.addEventListener("click", function () {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      window.location.href = "/index.html?logout=true";
    });
  }
});

function cadastrarAluno() {
  window.location.href = "cadastro-aluno.html";
}

function enviarFoto() {
  window.location.href = "upload-foto-aluno.html";
}

function listarAlunos() {
  window.location.href = "listagem-alunos.html";
}

function consultarAluno() {
  window.location.href = "consulta-aluno.html";
}

function atualizarAluno() {
  window.location.href = "atualiza-aluno.html";
}

function excluirAluno() {
  window.location.href = "inativa-aluno.html";
}