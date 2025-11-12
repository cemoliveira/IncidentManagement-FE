document.addEventListener("DOMContentLoaded", function () {
  const inputId = document.getElementById("input-id");
  const btnBuscar = document.getElementById("btn-buscar");
  const card = document.getElementById("resultado-card");
  const mensagem = document.getElementById("mensagem-retorno");

  async function consultarTurmaPorId(id) {
    try {
      const response = await apiFetch(`/schoolclasses/${id}`, { method: "GET" });

      card.innerHTML = "";

      if (response.status === 404) {
        card.innerHTML = "<p class='vazio'>Turma não encontrada.</p>";
        mensagem.textContent = "Nenhuma turma encontrada com esse ID.";
        mensagem.className = "mensagem erro";
        return;
      }

      if (!response.ok) throw new Error("Erro ao consultar turma");

      const schoolclass = await response.json();

      card.innerHTML = `
        <div class="card">
          <div class="card-header">
            <i class="fa-solid fa-chalkboard-user"></i>
            <h3>${schoolclass.name ?? "-"}</h3>
          </div>
          <div class="card-body">
            <p><strong>ID:</strong> ${schoolclass.id ?? "-"}</p>
            <p><strong>Turno:</strong> ${schoolclass.shift ?? "-"}</p>
            <p><strong>Ano:</strong> ${schoolclass.year ?? "-"}</p>
            <p><strong>Semestre:</strong> ${schoolclass.semester ?? "-"}</p>
            <p><strong>Cancelada:</strong> ${
              schoolclass.canceled === true ? "Sim" :
              schoolclass.canceled === false ? "Não" : "-"
            }</p>
          </div>
        </div>
      `;

      mensagem.textContent = "Consulta realizada com sucesso!";
      mensagem.className = "mensagem sucesso";
    } catch (error) {
      console.error("Erro ao consultar turma:", error);
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
    consultarTurmaPorId(id);
  });

  inputId.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      btnBuscar.click();
    }
  });
});