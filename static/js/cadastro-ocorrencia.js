document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form-cadastro");
  const mensagem = document.getElementById("mensagem-retorno");

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const idSchoolClass = document.getElementById("id-schoolclass").value.trim();
    const idStudent = document.getElementById("id-student").value.trim();
    const dateInput = document.getElementById("register-date").value.trim();
    const category = document.getElementById("category").value.trim();
    const type = document.getElementById("type").value.trim();
    const description = document.getElementById("description").value.trim();

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
    }

    const data = {
      idSchoolClass: idSchoolClass || null,
      idStudent: idStudent || null,
      registerDate: formattedDate,
      category,
      type,
      description,
    };

    try {
      const response = await apiFetch("/incidents", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (response.ok) {
        mensagem.textContent = "Ocorrência cadastrada com sucesso!";
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