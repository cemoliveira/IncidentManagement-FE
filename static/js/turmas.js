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

function cadastrarTurma() {
  window.location.href = "cadastro-turma.html";
}

function listarTurmas() {
  window.location.href = "listagem-turmas.html";
}

function consultarTurma() {
  window.location.href = "consulta-turma.html";
}

function listarCanceladas() {
  window.location.href = "listagem-turmas-canceladas.html";
}

function atualizarTurma() {
  window.location.href = "atualiza-turma.html";
}

function cancelarTurma() {
  window.location.href = "inativa-turma.html";
}