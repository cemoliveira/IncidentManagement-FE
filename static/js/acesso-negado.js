document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");
  const usuarioRaw = localStorage.getItem("usuario");

  if (!token) {
    window.location.href = "/index.html?error=unauthorized";
    return;
  }

  let usuario;
  try {
    usuario = usuarioRaw ? JSON.parse(usuarioRaw) : null;
  } catch {
    usuario = null;
  }

  document.getElementById("btn-home")?.addEventListener("click", () => {
    window.location.href = "home.html";
  });

  document.getElementById("btn-logout")?.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.location.href = "/index.html?logout=true";
  });
});