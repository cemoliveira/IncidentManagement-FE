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

      console.log(
        "DEBUG student.active:",
        student.active,
        typeof student.active
      );

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
          <div class="card-footer">
            ${`<button id="btn-inativar" class="btn-excluir">
                     <i class="fa-solid fa-user-slash"></i> Inativar Aluno
                   </button>`}
          </div>
        </div>
      `;

      const btnInativar = document.getElementById("btn-inativar");
      btnInativar.addEventListener("click", () => inativarAluno(student.id));

      mensagem.textContent = "Aluno encontrado.";
      mensagem.className = "mensagem sucesso";
    } catch (error) {
      console.error("Erro ao consultar aluno:", error);
      card.innerHTML = "<p class='vazio'>Erro na consulta.</p>";
      mensagem.textContent = "Falha na comunicação com o servidor.";
      mensagem.className = "mensagem erro";
    }
  }

  async function inativarAluno(id) {
    if (!confirm("Tem certeza que deseja inativar este aluno?")) return;

    try {
      const response = await apiFetch(`/students/${id}`, { method: "DELETE" });

      if (response.ok) {
        mensagem.textContent = "Aluno inativado com sucesso!";
        mensagem.className = "mensagem sucesso";
        card.innerHTML = "<p class='sucesso'>Aluno inativado!</p>";
      } else {
        const erro = await response.text();
        mensagem.textContent = "Erro ao inativar: " + erro;
        mensagem.className = "mensagem erro";
      }
    } catch (error) {
      console.error("Erro ao inativar aluno:", error);
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