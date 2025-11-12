document.addEventListener("DOMContentLoaded", () => {
  console.log("[Usuários] Página carregada — iniciando listagem...");

  const tabela = document.getElementById("tabela-usuarios");
  if (tabela) {
    carregarUsuarios();
  }
});

async function carregarUsuarios() {
  const tabelaUsuarios = document.getElementById("tabela-usuarios");
  const mensagem = document.getElementById("mensagem");

  if (!tabelaUsuarios) return;

  tabelaUsuarios.innerHTML = `<tr><td colspan="3">Carregando...</td></tr>`;
  if (mensagem) {
    mensagem.textContent = "";
    mensagem.className = "mensagem";
  }

  try {
    const data = await apiFetch("/users?sort=id");
    const usuarios = data.content || data || [];

    tabelaUsuarios.innerHTML = "";

    if (usuarios.length === 0) {
      tabelaUsuarios.innerHTML =
        "<tr><td colspan='3'>Nenhum usuário encontrado.</td></tr>";
      if (mensagem) {
        mensagem.textContent = "Nenhum usuário encontrado.";
        mensagem.className = "mensagem erro";
      }
      return;
    }

    usuarios.forEach((u) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${u.id ?? "-"}</td>
        <td>${u.name ?? "-"}</td>
        <td>${u.role ?? "-"}</td>
      `;
      tabelaUsuarios.appendChild(tr);
    });

    if (mensagem) {
      mensagem.textContent = `Total de usuários: ${usuarios.length}`;
      mensagem.className = "mensagem sucesso";
    }
  } catch (error) {
    console.error("[Usuários] Erro ao carregar:", error);
    tabelaUsuarios.innerHTML =
      "<tr><td colspan='3'>Erro ao carregar usuários.</td></tr>";
    if (mensagem) {
      mensagem.textContent = "Falha na comunicação com o servidor.";
      mensagem.className = "mensagem erro";
    }
  }
}

function cadastrarUsuario() {
  window.location.href = "cadastro-usuario.html";
}

function alterarSenha() {
  window.location.href = "altera-senha.html";
}

function listarUsuarios() {
  window.location.href = "listagem-usuarios.html";
}

function consultarUsuario() {
  window.location.href = "consulta-usuario.html";
}

function atualizarPerfil() {
  window.location.href = "atualiza-perfil.html";
}

function atualizarUsuario() {
  window.location.href = "atualiza-usuario.html";
}

function excluirUsuario() {
  window.location.href = "inativa-usuario.html";
}