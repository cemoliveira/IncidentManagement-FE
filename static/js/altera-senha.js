document.addEventListener("DOMContentLoaded", () => {
  console.log("[Senha] Página de alteração de senha carregada.");

  const token = localStorage.getItem("token");
  const usuario = (() => {
    try {
      return JSON.parse(localStorage.getItem("usuario"));
    } catch {
      return null;
    }
  })();

  const userId = usuario?.id;

  if (!token || !userId) {
    alert("Sessão expirada. Faça login novamente.");
    window.location.href = "/index.html?error=unauthorized";
    return;
  }

  document
    .getElementById("btn-home")
    ?.addEventListener("click", () => (window.location.href = "home.html"));
  document
    .getElementById("btn-backward")
    ?.addEventListener("click", () => window.history.back());
  document.getElementById("btn-logout")?.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "/index.html?logout=true";
  });

  const form = document.getElementById("form-alterar-senha");
  const mensagem = document.getElementById("mensagem-retorno");
  if (!form || !mensagem) return;

  const exibirMensagem = (texto, tipo = "") => {
    mensagem.textContent = texto;
    mensagem.className = `mensagem ${tipo}`;
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const oldPwd = document.getElementById("oldPassword").value.trim();
    const newPwd = document.getElementById("newPassword").value.trim();
    const confirmPwd = document.getElementById("confirmPassword").value.trim();

    if (!oldPwd || !newPwd || !confirmPwd) {
      exibirMensagem("Preencha todos os campos de senha.", "erro");
      return;
    }

    if (newPwd.length < 6) {
      exibirMensagem("A nova senha deve ter pelo menos 6 caracteres.", "erro");
      return;
    }

    if (newPwd !== confirmPwd) {
      exibirMensagem("As senhas novas não coincidem.", "erro");
      return;
    }

    try {
      const response = await fetch(
        "http://167.234.235.128:8090/users/password",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: userId,
            oldPassword: oldPwd,
            newPassword: newPwd,
          }),
        }
      );

      if (!response.ok) {
        const erroText = await response.text();
        exibirMensagem("Erro ao alterar senha: " + erroText, "erro");
        return;
      }

      exibirMensagem(
        "Senha alterada com sucesso! Redirecionando...",
        "sucesso"
      );
      form.reset();
      localStorage.clear();

      setTimeout(() => {
        window.location.href = "/index.html?passwordChanged=true";
      }, 2000);
    } catch (error) {
      console.error("[Senha] Erro ao alterar:", error);
      exibirMensagem("Falha na comunicação com o servidor.", "erro");
    }
  });
});