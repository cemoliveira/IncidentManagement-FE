document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form-cadastro");
  const mensagem = document.getElementById("mensagem-retorno");

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const data = {
      name: document.getElementById("name").value.trim(),
      login: document.getElementById("login").value.trim(),
      password: document.getElementById("password").value.trim(),
      role: document.getElementById("role").value,
    };

    try {
      const response = await apiFetch("/users", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (response.ok) {
        mensagem.textContent = "Usuário cadastrado com sucesso!";
        mensagem.className = "mensagem sucesso";
        form.reset();
      } else {
        const erro = await response.text();
        mensagem.textContent = "Erro ao cadastrar: " + erro;
        mensagem.className = "mensagem erro";
      }
    } catch (error) {
      mensagem.textContent = "Falha na comunicação com o servidor.";
      mensagem.className = "mensagem erro";
      console.error("Erro:", error);
    }
  });

  async function carregarRoles() {
    try {
      const response = await apiFetch("/users/roles");
      if (!response.ok) throw new Error("Erro ao carregar papéis");

      const roles = await response.json();
      const selectRole = document.getElementById("role");
      selectRole.innerHTML =
        '<option value="" disabled selected>Selecione</option>';

      roles.forEach((role) => {
        const option = document.createElement("option");
        option.value = role;
        option.textContent = role.charAt(0) + role.slice(1).toLowerCase();
        selectRole.appendChild(option);
      });
    } catch (error) {
      console.error("Erro ao carregar roles:", error);
    }
  }

  carregarRoles();
});