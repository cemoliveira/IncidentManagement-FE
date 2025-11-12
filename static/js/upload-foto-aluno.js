document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form-upload-foto");
  const mensagem = document.getElementById("mensagem-retorno");
  const preview = document.getElementById("preview");

  document.getElementById("image").addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        preview.src = e.target.result;
        preview.style.display = "block";
      };
      reader.readAsDataURL(file);
    } else {
      preview.style.display = "none";
    }
  });

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const id = document.getElementById("id").value.trim();
    const file = document.getElementById("image").files[0];

    if (!id || !file) {
      mensagem.textContent = "Por favor, preencha todos os campos.";
      mensagem.className = "mensagem erro";
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await apiFetch(`/students/${id}/image`, {
        method: "PATCH",
        body: formData,
      });

      if (response.ok) {
        mensagem.textContent = "Foto enviada com sucesso!";
        mensagem.className = "mensagem sucesso";
      } else {
        const erro = await response.text();
        mensagem.textContent = "Erro ao enviar foto: " + erro;
        mensagem.className = "mensagem erro";
      }
    } catch (error) {
      mensagem.textContent = "Falha na comunicação com o servidor.";
      mensagem.className = "mensagem erro";
      console.error("Erro:", error);
    }
  });
});