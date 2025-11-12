document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form-cadastro");
  const mensagem = document.getElementById("mensagem-retorno");

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const data = {
      name: document.getElementById("name").value.trim(),
      shift: document.getElementById("shift").value.trim(),
      year: document.getElementById("year").value.trim(),
      semester: document.getElementById("semester").value,
    };

    try {
      const response = await apiFetch("/schoolclasses", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (response.ok) {
        mensagem.textContent = "Turma cadastrada com sucesso!";
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

  async function carregarShifts() {
    try {
      const response = await apiFetch("/schoolclasses/shifts");
      if (!response.ok) throw new Error("Erro ao carregar turnos");

      const shifts = await response.json();
      const selectShift = document.getElementById("shift");
      selectShift.innerHTML =
        '<option value="" disabled selected>Selecione</option>';

      shifts.forEach((shift) => {
        const option = document.createElement("option");
        option.value = shift;
        option.textContent = shift.charAt(0) + shift.slice(1).toLowerCase();
        selectShift.appendChild(option);
      });
    } catch (error) {
      console.error("Erro ao carregar turnos:", error);
    }
  }

  async function carregarSemesters() {
    try {
      const response = await apiFetch("/schoolclasses/semesters");
      if (!response.ok) throw new Error("Erro ao carregar semestres");

      const semesters = await response.json();
      const selectSemester = document.getElementById("semester");
      selectSemester.innerHTML =
        '<option value="" disabled selected>Selecione</option>';

      semesters.forEach((semester) => {
        const option = document.createElement("option");
        option.value = semester;
        option.textContent = semester.charAt(0) + semester.slice(1).toLowerCase();
        selectSemester.appendChild(option);
      });
    } catch (error) {
      console.error("Erro ao carregar semestres:", error);
    }
  }

  carregarShifts();
  carregarSemesters();
});