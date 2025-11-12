document.addEventListener("DOMContentLoaded", function () {
  const inputId = document.getElementById("input-id");
  const btnBuscar = document.getElementById("btn-buscar");
  const card = document.getElementById("resultado-card");
  const mensagem = document.getElementById("mensagem-retorno");

  const usuarioLogado = JSON.parse(localStorage.getItem("usuario") || "{}");

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

      console.log("DEBUG user.active:", user.active, typeof user.active);

      const isSelf = usuarioLogado?.id === user.id;

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
          <div class="card-footer">
            ${
              isSelf
                ? `<button class="btn-excluir" disabled title="Você não pode inativar a si mesmo">
                     <i class="fa-solid fa-ban"></i> Inativação Bloqueada
                   </button>`
                : `<button id="btn-inativar" class="btn-excluir">
                     <i class="fa-solid fa-user-slash"></i> Inativar Usuário
                   </button>`
            }
          </div>
        </div>
      `;

      if (!isSelf) {
        const btnInativar = document.getElementById("btn-inativar");
        btnInativar.addEventListener("click", () => inativarUsuario(user.id));
      }

      mensagem.textContent = "Usuário encontrado.";
      mensagem.className = "mensagem sucesso";
    } catch (error) {
      console.error("Erro ao consultar usuário:", error);
      card.innerHTML = "<p class='vazio'>Erro na consulta.</p>";
      mensagem.textContent = "Falha na comunicação com o servidor.";
      mensagem.className = "mensagem erro";
    }
  }

  async function inativarUsuario(id) {
    if (!confirm("Tem certeza que deseja inativar este usuário?")) return;

    try {
      const response = await apiFetch(`/users/${id}`, { method: "DELETE" });

      if (response.ok) {
        mensagem.textContent = "Usuário inativado com sucesso!";
        mensagem.className = "mensagem sucesso";
        card.innerHTML = "<p class='sucesso'>Usuário inativado!</p>";
      } else {
        const erro = await response.text();
        mensagem.textContent = "Erro ao inativar: " + erro;
        mensagem.className = "mensagem erro";
      }
    } catch (error) {
      console.error("Erro ao inativar usuário:", error);
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