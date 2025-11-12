document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form-atualizar");
  const mensagem = document.getElementById("mensagem-retorno");

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const data = {
      id: parseInt(document.getElementById("id").value.trim(), 10),
      role: document.getElementById("role").value,
    };

    try {
      const response = await apiFetch("/users", {
        method: "PATCH",
        body: JSON.stringify(data),
      });

      if (response.ok) {
        mensagem.textContent = "Perfil atualizado com sucesso!";
        mensagem.className = "mensagem sucesso";
        form.reset();
      } else {
        const erro = await response.text();
        mensagem.textContent = "Erro ao atualizar: " + erro;
        mensagem.className = "mensagem erro";
      }
    } catch (error) {
      console.error("Erro:", error);
      mensagem.textContent = "Falha na comunicação com o servidor.";
      mensagem.className = "mensagem erro";
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