document.addEventListener("DOMContentLoaded", () => {
  const tabela = document.querySelector("[data-tabela-turmas]");
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
    selectOrdenacao.addEventListener("change", () => carregarTurmas(0));
  }

  console.log(`[Listagem] Carregando turmas de ${urlBase}...`);
  carregarTurmas();

  async function carregarTurmas(pagina = 0) {
    const campoOrdenacao =
      selectOrdenacao && selectOrdenacao.value ? selectOrdenacao.value : "id";

    try {
      const resp = await apiFetch(
        `${urlBase}?page=${pagina}&size=${tamanhoPagina}&sort=${encodeURIComponent(
          campoOrdenacao
        )}`
      );
      const data = await resp.json();

      const turmas = data?.content ?? [];
      tbody.innerHTML = "";

      if (!Array.isArray(turmas) || turmas.length === 0) {
        tbody.innerHTML = `<tr><td colspan="${colunas.length}">Nenhuma turma encontrada.</td></tr>`;
        if (mensagem) {
          mensagem.textContent = "Nenhuma turma encontrada.";
          mensagem.className = "mensagem erro";
        }
        return;
      }

      turmas.forEach((turma) => {
        const tr = document.createElement("tr");
        tr.innerHTML = colunas
          .map((campo) => `<td>${turma[campo] ?? "-"}</td>`)
          .join("");
        tbody.appendChild(tr);
      });

      if (mensagem) {
        mensagem.textContent = `Total de turmas: ${
          data.totalElements ?? turmas.length
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
        btnPrev.onclick = () => !data.first && carregarTurmas(paginaAtual - 1);
      }

      if (btnNext) {
        btnNext.disabled = !!data.last;
        btnNext.onclick = () => !data.last && carregarTurmas(paginaAtual + 1);
      }
    } catch (err) {
      console.error("[Erro] Falha ao carregar turmas:", err);
      tbody.innerHTML = `<tr><td colspan="${colunas.length}">Erro ao carregar turmas.</td></tr>`;
      if (mensagem) {
        mensagem.textContent = "Falha na comunicação com o servidor.";
        mensagem.className = "mensagem erro";
      }
    }
  }
});