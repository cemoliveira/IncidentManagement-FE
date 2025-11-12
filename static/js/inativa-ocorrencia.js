document.addEventListener("DOMContentLoaded", function () {
  const inputId = document.getElementById("input-id");
  const btnBuscar = document.getElementById("btn-buscar");
  const card = document.getElementById("resultado-card");
  const mensagem = document.getElementById("mensagem-retorno");

  async function consultarOcorrenciaPorId(id) {
    try {
      const response = await apiFetch(`/incidents/${id}`, {
        method: "GET",
      });

      card.innerHTML = "";

      if (response.status === 404) {
        card.innerHTML = "<p class='vazio'>Ocorrência não encontrada.</p>";
        mensagem.textContent = "Nenhuma ocorrência encontrada com esse ID.";
        mensagem.className = "mensagem erro";
        return;
      }

      if (!response.ok) throw new Error("Erro ao consultar ocorrência");

      const incident = await response.json();

      console.log(
        "DEBUG incident.deleted:",
        incident.deleted,
        typeof incident.deleted
      );

      card.innerHTML = `
        <div class="card">
          <div class="card-header">
            <i class="fa-solid fa-chalkboard-user"></i>
            <h3>${incident.description ?? "-"}</h3>
          </div>
          <div class="card-body">
            <p><strong>ID:</strong> ${incident.id ?? "-"}</p>
            <p><strong>Categoria:</strong> ${incident.category ?? "-"}</p>
            <p><strong>Tipo:</strong> ${incident.type ?? "-"}</p>
            <p><strong>Cancelada:</strong> ${
              incident.deleted === true ? "Sim" :
              incident.deleted === false ? "Não" : "-"
            }</p>
          </div>
          <div class="card-footer">
            ${`<button id="btn-cancelar" class="btn-excluir">
                     <i class="fa-solid fa-user-slash"></i> Cancelar turma
                   </button>`}
          </div>
        </div>
      `;

      const btnCancelar = document.getElementById("btn-cancelar");
      btnCancelar.addEventListener("click", () =>
        cancelarOcorrencia(incident.id)
      );

      mensagem.textContent = "Ocorrência encontrado.";
      mensagem.className = "mensagem sucesso";
    } catch (error) {
      console.error("Erro ao consultar ocorrência:", error);
      card.innerHTML = "<p class='vazio'>Erro na consulta.</p>";
      mensagem.textContent = "Falha na comunicação com o servidor.";
      mensagem.className = "mensagem erro";
    }
  }

  async function cancelarOcorrencia(id) {
    if (!confirm("Tem certeza que deseja cancelar esta ocorrência?")) return;

    try {
      const response = await apiFetch(`/incidents/${id}`, { method: "DELETE" });

      if (response.ok) {
        mensagem.textContent = "Ocorrência cancelada com sucesso!";
        mensagem.className = "mensagem sucesso";
        card.innerHTML = "<p class='sucesso'>Ocorrência Cancelada!</p>";
      } else {
        const erro = await response.text();
        mensagem.textContent = "Erro ao cancelar: " + erro;
        mensagem.className = "mensagem erro";
      }
    } catch (error) {
      console.error("Erro ao cancelar ocorrência:", error);
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
    consultarOcorrenciaPorId(id);
  });

  inputId.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      btnBuscar.click();
    }
  });
});