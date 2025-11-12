document.addEventListener("DOMContentLoaded", function () {
  const inputId = document.getElementById("input-id");
  const btnBuscar = document.getElementById("btn-buscar");
  const card = document.getElementById("resultado-card");
  const mensagem = document.getElementById("mensagem-retorno");

  async function consultarAlunoPorId(id) {
    try {
      const response = await apiFetch(`/students/${id}`, { method: "GET" });

      card.innerHTML = "";

      if (response.status === 404) {
        card.innerHTML = "<p class='vazio'>Aluno não encontrado.</p>";
        mensagem.textContent = "Nenhum aluno encontrado com esse ID.";
        mensagem.className = "mensagem erro";
        return;
      }

      if (!response.ok) throw new Error("Erro ao consultar aluno");

      const student = await response.json();

      card.innerHTML = `
        <div class="card">
          <div class="card-header">
            <i class="fa-solid fa-user-graduate"></i>
            <h3>${student.name ?? "-"}</h3>
          </div>
          <div class="card-body">
            <p><strong>ID:</strong> ${student.id ?? "-"}</p>
            <p><strong>Foto:</strong></p>
              <div class="foto-container">
                ${
                  student.imageUrl
                    ? `<img src="${student.imageUrl}" alt="Foto de ${student.name}" />`
                    : `<span>-</span>`
                }
              </div>
            <p><strong>Data de Nascimento:</strong> ${
              student.birthDate ?? "-"
            }</p>
            <p><strong>Ativo:</strong> ${
              student.active === true
                ? "Sim"
                : student.active === false
                ? "Não"
                : "-"
            }</p>
          </div>
        </div>
      `;

      mensagem.textContent = "Consulta realizada com sucesso!";
      mensagem.className = "mensagem sucesso";
    } catch (error) {
      console.error("Erro ao consultar aluno:", error);
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
    consultarAlunoPorId(id);
  });

  inputId.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      btnBuscar.click();
    }
  });
});