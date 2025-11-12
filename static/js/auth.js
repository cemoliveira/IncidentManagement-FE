document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.warn("[Auth] Sem token — redirecionando para login.");
    window.location.href = "/index.html?error=unauthorized";
    return;
  }

  document.getElementById("btn-home")?.addEventListener("click", () => {
    window.location.href = "home.html";
  });

  document.getElementById("btn-backward")?.addEventListener("click", () => {
    window.history.back();
  });

  document.getElementById("btn-logout")?.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "/index.html?logout=true";
  });

  console.log("[Auth] Sessão ativa, token carregado.");
});

/**
 * apiFetch — wrapper global para chamadas à API autenticadas.
 * @param {string} url URL completa ou relativa (ex: "/users?page=0")
 * @param {object} options opções fetch (sem precisar do header Authorization)
 * @returns {Promise<Response>}
 */
async function apiFetch(url, options = {}) {
  const token = localStorage.getItem("token");
  const fullUrl = url.startsWith("http")
    ? url
    : `http://167.234.235.128:8090${url}`;

  const config = {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  };

  if (!(options.body instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
  }

  console.log(`[apiFetch] ${config.method || "GET"} ${fullUrl}`);

  const response = await fetch(fullUrl, config);

  if (response.status === 401) {
    console.warn("[apiFetch] 401 — Não autorizado, redirecionando...");
    window.location.href = "/index.html?error=unauthorized";
    return Promise.reject(new Error("401 Unauthorized"));
  }

  if (response.status === 403) {
    console.warn("[apiFetch] 403 — Acesso negado, redirecionando...");
    window.location.href = "acesso-negado.html";
    return Promise.reject(new Error("403 Forbidden"));
  }

  return response;
}