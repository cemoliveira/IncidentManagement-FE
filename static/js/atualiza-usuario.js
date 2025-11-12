document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form-atualiza-usuario");
  const mensagem = document.getElementById("mensagem-retorno");

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const id = document.getElementById("id").value.trim();
    const name = document.getElementById("name").value.trim();
    const login = document.getElementById("login").value.trim();

    if (!id) {
      mensagem.textContent = "ID obrigatório.";
      mensagem.className = "mensagem erro";
      return;
    }

    try {
      const getResp = await apiFetch(`/users/${id}`, { method: "GET" });
      if (!getResp.ok) {
        const t = await getResp.text();
        mensagem.textContent = "Erro ao carregar usuário: " + t;
        mensagem.className = "mensagem erro";
        return;
      }
      const existing = await getResp.json();

      const payload = {
        ...existing,
        id: Number(id),
        name: name === "" ? existing.name : name,
        login: login === "" ? existing.login : login
      };

      const putResp = await apiFetch("/users", {
        method: "PUT",
        body: JSON.stringify(payload)
      });

      if (putResp.ok) {
        mensagem.textContent = "Usuário atualizado com sucesso!";
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