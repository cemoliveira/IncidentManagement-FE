document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);

  const erroLogin = document.getElementById("erro-login");
  const logoutOk = document.getElementById("logout-ok");

  if (urlParams.has("error") && erroLogin) erroLogin.style.display = "block";
  if (urlParams.has("logout") && logoutOk) logoutOk.style.display = "block";

  const form = document.getElementById("login-form");
  if (!form) return;

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const login = document.getElementById("login").value.trim();
    const password = document.getElementById("password").value.trim();

    if (erroLogin) erroLogin.style.display = "none";

    try {
      const response = await fetch("http://167.234.235.128:8090/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });

      if (!response.ok) {
        if (erroLogin) erroLogin.style.display = "block";
        return;
      }

      const data = await response.json();

      if (!data.tokenJWT) {
        if (erroLogin) erroLogin.style.display = "block";
        return;
      }

      localStorage.setItem("token", data.tokenJWT);
      localStorage.setItem(
        "usuario",
        JSON.stringify({
          id: data.id,
          login: data.login,
        })
      );

      window.location.href = "/templates/home.html";
    } catch (error) {
      console.error("Erro ao tentar logar:", error);
      if (erroLogin) erroLogin.style.display = "block";
    }
  });
});