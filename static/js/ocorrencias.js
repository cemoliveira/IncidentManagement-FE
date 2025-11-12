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

function dashboardOcorrencia() {
  window.location.href = "dashboard-ocorrencias.html";
}

function cadastrarOcorrencia() {
  window.location.href = "cadastro-ocorrencia.html";
}

function listarTodasOcorrencias() {
  window.location.href = "listagem-ocorrencias.html";
}

function listarAguardandoAtendimento() {
  window.location.href = "listagem-ocorrencias-aguardando.html";
}

function listarEmAtendimento() {
  window.location.href = "listagem-ocorrencias-atendendo.html";
}

function listarAtivas() {
  window.location.href = "listagem-ocorrencias-ativas.html";
}

function listarResolvidas() {
  window.location.href = "listagem-ocorrencias-resolvidas.html";
}

function listarEncerradasSemSolucao() {
  window.location.href = "listagem-ocorrencias-nao-resolvidas.html";
}

function listarFechadas() {
  window.location.href = "listagem-ocorrencias-fechadas.html";
}

function atualizarOcorrencia() {
  window.location.href = "atualiza-ocorrencia.html";
}

function alterarStatusOcorrencia() {
  window.location.href = "atualiza-status.html";
}

function excluirOcorrencia() {
  window.location.href = "inativa-ocorrencia.html";
}