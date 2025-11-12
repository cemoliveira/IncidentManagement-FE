document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form-atualiza-ocorrencia");
  const mensagem = document.getElementById("mensagem-retorno");

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const id = document.getElementById("id").value.trim();
    const idSchoolClass = document.getElementById("id-schoolclass").value.trim();
    const idStudent = document.getElementById("id-student").value.trim();
    const category = document.getElementById("category").value.trim();
    const type = document.getElementById("type").value.trim();
    const description = document.getElementById("description").value.trim();

    if (!id) {
      mensagem.textContent = "ID obrigatório.";
      mensagem.className = "mensagem erro";
      return;
    }

    try {
      const getResp = await apiFetch(`/incidents/${id}`, { method: "GET" });
      if (!getResp.ok) {
        const t = await getResp.text();
        mensagem.textContent = "Erro ao carregar ocorrencia: " + t;
        mensagem.className = "mensagem erro";
        return;
      }
      const existing = await getResp.json();

      const payload = {
        ...existing,
        id: Number(id),
        idSchoolClass: idSchoolClass === "" ? existing.idSchoolClass : idSchoolClass,
        idStudent: idStudent === "" ? existing.idStudent : idStudent,
        category: category === "" ? existing.category : category,
        type: type === "" ? existing.type : type,
        description: description === "" ? existing.description : description
      };

      const putResp = await apiFetch("/incidents", {
        method: "PUT",
        body: JSON.stringify(payload)
      });

      if (putResp.ok) {
        mensagem.textContent = "Ocorrência atualizada com sucesso!";
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
  
  async function carregarCategories() {
    try {
      const response = await apiFetch("/incidents/categories");
      if (!response.ok) throw new Error("Erro ao carregar categorias");

      const categories = await response.json();
      const selectCategory = document.getElementById("category");
      selectCategory.innerHTML =
        '<option value="" disabled selected>Selecione</option>';

      categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent =
          category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
        selectCategory.appendChild(option);
      });

      selectCategory.addEventListener("change", () => {
        const selectedCategory = selectCategory.value;
        carregarTypes(selectedCategory);
      });
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    }
  }

  async function carregarTypes(category) {
    try {
      if (!category) return;

      const response = await apiFetch(`/incidents/types/${category}`);
      if (!response.ok) throw new Error("Erro ao carregar tipos");

      const types = await response.json();
      const selectType = document.getElementById("type");
      selectType.innerHTML =
        '<option value="" disabled selected>Selecione</option>';

      types.forEach((type) => {
        const option = document.createElement("option");
        option.value = type;
        option.textContent =
          type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
        selectType.appendChild(option);
      });
    } catch (error) {
      console.error("Erro ao carregar tipos:", error);
    }
  }

  carregarCategories();
});