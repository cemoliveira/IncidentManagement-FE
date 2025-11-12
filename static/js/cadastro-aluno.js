document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form-cadastro");
  const mensagem = document.getElementById("mensagem-retorno");

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const birthInput = document.getElementById("birth-date").value;
    const [year, month, day] = birthInput.split("-");
    const formattedDate = `${day}/${month}/${year}`;

    const data = {
      name: document.getElementById("name").value.trim(),
      birthDate: formattedDate,
    };

    try {
      const response = await apiFetch("/students", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (response.ok) {
        mensagem.textContent = "Aluno cadastrado com sucesso!";
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
});