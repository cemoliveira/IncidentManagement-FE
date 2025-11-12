document.addEventListener("DOMContentLoaded", function () {
  const inputId = document.getElementById("input-id");
  const btnBuscar = document.getElementById("btn-buscar");
  const card = document.getElementById("resultado-card");
  const mensagem = document.getElementById("mensagem-retorno");

  async function consultarUsuarioPorId(id) {
    try {
      const response = await apiFetch(`/users/${id}`, { method: "GET" });

      card.innerHTML = "";

      if (response.status === 404) {
        card.innerHTML = "<p class='vazio'>Usuário não encontrado.</p>";
        mensagem.textContent = "Nenhum usuário encontrado com esse ID.";
        mensagem.className = "mensagem erro";
        return;
      }

      if (!response.ok) throw new Error("Erro ao consultar usuário");

      const user = await response.json();

      card.innerHTML = `
        <div class="card">
          <div class="card-header">
            <i class="fa-solid fa-user"></i>
            <h3>${user.name ?? "-"}</h3>
          </div>
          <div class="card-body">
            <p><strong>ID:</strong> ${user.id ?? "-"}</p>
            <p><strong>Login:</strong> ${user.login ?? "-"}</p>
            <p><strong>Papel:</strong> ${user.role ?? "-"}</p>
            <p><strong>Ativo:</strong> ${
              user.active === true
                ? "Sim"
                : user.active === false
                ? "Não"
                : "-"
            }</p>
          </div>
        </div>
      `;

      mensagem.textContent = "Consulta realizada com sucesso!";
      mensagem.className = "mensagem sucesso";
    } catch (error) {
      console.error("Erro ao consultar usuário:", error);
      card.innerHTML = "<p class='vazio'>Erro na consulta.</p>";
      mensagem.textContent = "Falha na comunicação com o servidor.";
      mensagem.className = "mensagem erro";
    }
  }

  btnBuscar.addEventListener("click", () => {
    const id = inputId.value.trim();
    if (!id) {
      mensagem.textContent = "Informe um ID válido!";
      mensagem.className = "mensagem erro";
      return;
    }
    consultarUsuarioPorId(id);
  });

  inputId.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      btnBuscar.click();
    }
  });
});