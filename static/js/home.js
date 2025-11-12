document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");
  const usuarioRaw = localStorage.getItem("usuario");

  if (!token) {
    window.location.href = "/index.html?error=unauthorized";
    return;
  }

  let login = "";
  if (usuarioRaw) {
    try {
      const usuarioObj = JSON.parse(usuarioRaw);
      login = usuarioObj.login || "";
    } catch {
      login = usuarioRaw;
    }
  }

  const usuarioLogado = document.getElementById("usuario-logado");
  if (usuarioLogado) {
    usuarioLogado.textContent = login || "Usuário";
  }

  const btnLogout = document.getElementById("btn-logout");
  if (btnLogout) {
    btnLogout.addEventListener("click", function () {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      localStorage.removeItem("id");
      window.location.href = "/index.html?logout=true";
    });
  }
});

function navigateTo(page) {
  window.location.href = page;
}