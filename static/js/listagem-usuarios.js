document.addEventListener("DOMContentLoaded", () => {
  const tabela = document.querySelector("[data-tabela-usuarios]");
  if (!tabela) {
    console.warn("[Listagem] Nenhuma tabela encontrada nesta página.");
    return;
  }

  const tbody = tabela.querySelector("tbody");
  const urlBase = tabela.dataset.url;
  const colunas = (tabela.dataset.colunas || "").split(",");
  const tamanhoPagina = 8;

  const selectOrdenacao = document.getElementById("select-ordenacao");
  const mensagem =
    document.getElementById("mensagem") ||
    document.getElementById("mensagem-retorno");
  const paginaInfo = document.getElementById("pagina-info");
  const btnPrev = document.getElementById("btn-prev");
  const btnNext = document.getElementById("btn-next");

  if (selectOrdenacao) {
    selectOrdenacao.addEventListener("change", () => carregarUsuarios(0));
  }

  console.log(`[Listagem] Carregando usuários de ${urlBase}...`);
  carregarUsuarios();

  async function carregarUsuarios(pagina = 0) {
    const campo =
      selectOrdenacao && selectOrdenacao.value ? selectOrdenacao.value : "id";

    try {
      const resp = await apiFetch(
        `${urlBase}?page=${pagina}&size=${tamanhoPagina}&sort=${encodeURIComponent(
          campo
        )}`
      );

      const data = await resp.json();
      const usuarios = data?.content ?? [];
      tbody.innerHTML = "";

      if (!Array.isArray(usuarios) || usuarios.length === 0) {
        tbody.innerHTML = `<tr><td colspan="${colunas.length}">Nenhum usuário encontrado.</td></tr>`;
        if (mensagem) {
          mensagem.textContent = "Nenhum usuário encontrado.";
          mensagem.className = "mensagem erro";
        }
        return;
      }

      usuarios.forEach((item) => {
        const tr = document.createElement("tr");
        tr.innerHTML = colunas
          .map((campo) => `<td>${item[campo] ?? "-"}</td>`)
          .join("");
        tbody.appendChild(tr);
      });

      if (mensagem) {
        mensagem.textContent = `Total de usuários: ${
          data.totalElements ?? usuarios.length
        }`;
        mensagem.className = "mensagem sucesso";
      }

      const paginaAtual = data.number ?? pagina;
      if (paginaInfo)
        paginaInfo.textContent = `Página ${paginaAtual + 1} de ${
          data.totalPages ?? 1
        }`;

      if (btnPrev) {
        btnPrev.disabled = !!data.first;
        btnPrev.onclick = () => !data.first && carregarUsuarios(paginaAtual - 1);
      }
      if (btnNext) {
        btnNext.disabled = !!data.last;
        btnNext.onclick = () => !data.last && carregarUsuarios(paginaAtual + 1);
      }
    } catch (err) {
      console.error("[Erro] Falha ao carregar usuários:", err);
      tbody.innerHTML = `<tr><td colspan="${colunas.length}">Erro ao carregar usuários.</td></tr>`;
      if (mensagem) {
        mensagem.textContent = "Falha na comunicação com o servidor.";
        mensagem.className = "mensagem erro";
      }
    }
  }
});