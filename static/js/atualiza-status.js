document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form-atualizar");
  const mensagem = document.getElementById("mensagem-retorno");

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const id = document.getElementById("id").value.trim();
    const status = document.getElementById("status").value.trim();
    const dateInput = document.getElementById("update-date").value.trim();

    let formattedDate = null;
    if (dateInput) {
      const date = new Date(dateInput);
      if (!isNaN(date.getTime())) {
        const dia = String(date.getDate()).padStart(2, "0");
        const mes = String(date.getMonth() + 1).padStart(2, "0");
        const ano = date.getFullYear();
        const hora = String(date.getHours()).padStart(2, "0");
        const minuto = String(date.getMinutes()).padStart(2, "0");
        formattedDate = `${dia}/${mes}/${ano} - ${hora}:${minuto}`;
      }
    } else {
      const now = new Date();
      const dia = String(now.getDate()).padStart(2, "0");
      const mes = String(now.getMonth() + 1).padStart(2, "0");
      const ano = now.getFullYear();
      const hora = String(now.getHours()).padStart(2, "0");
      const minuto = String(now.getMinutes()).padStart(2, "0");
      formattedDate = `${dia}/${mes}/${ano} - ${hora}:${minuto}`;
    }

    const data = {
      id: parseInt(id, 10),
      status,
      updateDate: formattedDate,
    };

    try {
      const response = await apiFetch("/incidents/status", {
        method: "PATCH",
        body: JSON.stringify(data),
      });

      if (response.ok) {
        mensagem.textContent = "Status atualizado com sucesso!";
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

  async function carregarStatus() {
    try {
      const response = await apiFetch("/incidents/status");
      if (!response.ok) throw new Error("Erro ao carregar status");

      const statusList = await response.json();
      const selectStatus = document.getElementById("status");
      selectStatus.innerHTML =
        '<option value="" disabled selected>Selecione</option>';

      statusList.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.name;
        option.textContent = item.description || item.name;
        selectStatus.appendChild(option);
      });
    } catch (error) {
      console.error("Erro ao carregar status:", error);
    }
  }

  carregarStatus();
});