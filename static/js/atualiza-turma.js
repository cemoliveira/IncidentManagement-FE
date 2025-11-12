document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form-atualiza-turma");
  const mensagem = document.getElementById("mensagem-retorno");

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const id = document.getElementById("id").value.trim();
    const name = document.getElementById("name").value.trim();
    const shift = document.getElementById("shift").value.trim();
    const semester = document.getElementById("semester").value.trim();

    if (!id) {
      mensagem.textContent = "ID obrigatório.";
      mensagem.className = "mensagem erro";
      return;
    }

    try {
      const getResp = await apiFetch(`/schoolclasses/${id}`, { method: "GET" });
      if (!getResp.ok) {
        const t = await getResp.text();
        mensagem.textContent = "Erro ao carregar turma: " + t;
        mensagem.className = "mensagem erro";
        return;
      }
      const existing = await getResp.json();

      const payload = {
        ...existing,
        id: Number(id),
        name: name === "" ? existing.name : name,
        shift: shift === "" ? existing.shift : shift,
        semester: semester === "" ? existing.semester : semester
      };

      const putResp = await apiFetch("/schoolclasses", {
        method: "PUT",
        body: JSON.stringify(payload)
      });

      if (putResp.ok) {
        mensagem.textContent = "Turma atualizada com sucesso!";
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