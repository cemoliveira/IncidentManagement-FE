document.addEventListener("DOMContentLoaded", () => {
  const tabela = document.querySelector("[data-tabela-alunos]");
  if (!tabela) {
    console.warn("[Listagem] Nenhuma tabela encontrada nesta página.");
    return;
  }

  const tbody = tabela.querySelector("tbody");
  const urlBase = tabela.dataset.url;
  const colunas = (tabela.dataset.colunas || "").split(",");
  const tamanhoPagina = 4;

  const selectOrdenacao = document.getElementById("select-ordenacao");
  const mensagem =
    document.getElementById("mensagem") ||
    document.getElementById("mensagem-retorno");
  const paginaInfo = document.getElementById("pagina-info");
  const btnPrev = document.getElementById("btn-prev");
  const btnNext = document.getElementById("btn-next");

  if (selectOrdenacao) {
    selectOrdenacao.addEventListener("change", () => carregarAlunos(0));
  }

  console.log(`[Listagem] Carregando alunos de ${urlBase}...`);
  carregarAlunos();

  async function carregarAlunos(pagina = 0) {
    const campoOrdenacao =
      selectOrdenacao && selectOrdenacao.value ? selectOrdenacao.value : "id";

    try {
      const resp = await apiFetch(
        `${urlBase}?page=${pagina}&size=${tamanhoPagina}&sort=${encodeURIComponent(
          campoOrdenacao
        )}`
      );
      const data = await resp.json();

      const alunos = data?.content ?? [];
      tbody.innerHTML = "";

      if (!Array.isArray(alunos) || alunos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="${colunas.length}">Nenhum aluno encontrado.</td></tr>`;
        if (mensagem) {
          mensagem.textContent = "Nenhum aluno encontrado.";
          mensagem.className = "mensagem erro";
        }
        return;
      }

      alunos.forEach((aluno) => {
        const tr = document.createElement("tr");
        tr.innerHTML = colunas
          .map((campo) => {
            if (campo === "imageUrl") {
              const imageSrc =
                aluno.imageUrl || aluno.foto || "/static/images/user-default.png";
              return `
                <td style="text-align:center;">
                  <img 
                    src="${imageSrc}" 
                    alt="Foto de ${aluno.name ?? aluno.nome ?? "Aluno"}" 
                    class="foto-aluno"
                    onerror="this.src='/static/images/user-default.png'"
                  />
                </td>`;
            }
            return `<td>${aluno[campo] ?? aluno[campo.toLowerCase()] ?? "-"}</td>`;
          })
          .join("");
        tbody.appendChild(tr);
      });

      if (mensagem) {
        mensagem.textContent = `Total de alunos: ${
          data.totalElements ?? alunos.length
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
        btnPrev.onclick = () => !data.first && carregarAlunos(paginaAtual - 1);
      }

      if (btnNext) {
        btnNext.disabled = !!data.last;
        btnNext.onclick = () => !data.last && carregarAlunos(paginaAtual + 1);
      }
    } catch (err) {
      console.error("[Erro] Falha ao carregar alunos:", err);
      tbody.innerHTML = `<tr><td colspan="${colunas.length}">Erro ao carregar alunos.</td></tr>`;
      if (mensagem) {
        mensagem.textContent = "Falha na comunicação com o servidor.";
        mensagem.className = "mensagem erro";
      }
    }
  }
});