document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form-atualiza-aluno");
  const mensagem = document.getElementById("mensagem-retorno");

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const id = document.getElementById("id").value.trim();
    const name = document.getElementById("name").value.trim();
    const birthInput = document.getElementById("birth-date").value;
    let formattedDate = null;
    if (birthInput) {
      const [year, month, day] = birthInput.split("-");
      formattedDate = `${day}/${month}/${year}`;
    }

    if (!id) {
      mensagem.textContent = "ID obrigatório.";
      mensagem.className = "mensagem erro";
      return;
    }

    try {
      const getResp = await apiFetch(`/students/${id}`, { method: "GET" });
      if (!getResp.ok) {
        const t = await getResp.text();
        mensagem.textContent = "Erro ao carregar turma: " + t;
        mensagem.className = "mensagem erro";
        return;
      }
      const existing = await getResp.json();

      const payload = {
        ...existing,
        id: Number(id),
        name: name === "" ? existing.name : name,
        ...(formattedDate ? { birthDate: formattedDate } : {})
      };

      const putResp = await apiFetch("/students", {
        method: "PUT",
        body: JSON.stringify(payload)
      });

      if (putResp.ok) {
        mensagem.textContent = "Aluno atualizado com sucesso!";
        mensagem.className = "mensagem sucesso";
      } else {
        const erro = await putResp.text();
        mensagem.textContent = "Erro ao atualizar: " + erro;
        mensagem.className = "mensagem erro";
      }
    } catch (error) {
      console.error("Erro:", error);
      mensagem.textContent = "Falha na comunicação com o servidor.";
      mensagem.className = "mensagem erro";
    }
  });
});