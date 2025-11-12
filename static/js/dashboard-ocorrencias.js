document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "/index.html?error=unauthorized";
        return;
    }

    document.getElementById("btn-home").addEventListener("click", () => {
        window.location.href = "home.html";
    });

    document.getElementById("btn-backward").addEventListener("click", () => {
        window.location.href = "ocorrencias.html";
    });

    document.getElementById("btn-logout").addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        window.location.href = "/index.html?logout=true";
    });

    await carregarDashboard();
});

const API_BASE_URL = 'http://167.234.235.128:8090';

async function carregarDashboard() {
    const mensagem = document.getElementById("mensagem-retorno");
    
    try {
        console.log("🔄 Iniciando carregamento do dashboard...");
        
        const apiURL = `${API_BASE_URL}/incidents/summary`;
        console.log("📡 Tentando acessar:", apiURL);

        const resp = await fetch(apiURL, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`,
                'Content-Type': 'application/json'
            }
        });

        console.log("📊 Status da resposta:", resp.status);

        if (resp.status === 500) {
            const errorText = await resp.text();
            console.error("❌ Erro 500 - Detalhes:", errorText);
            throw new Error(`Erro interno do servidor (500). Detalhes: ${errorText.substring(0, 200)}`);
        }

        if (!resp.ok) {
            throw new Error(`Erro HTTP: ${resp.status} - ${resp.statusText}`);
        }

        const data = await resp.json();
        console.log("✅ Dados recebidos:", data);
        
        preencherResumo(data);
        criarGraficos(data);
        
        mensagem.textContent = "Dashboard carregado com sucesso!";
        mensagem.className = "mensagem sucesso";

    } catch (error) {
        console.error("❌ Erro ao carregar dashboard:", error);
        
        let mensagemErro = `Falha ao carregar dashboard: ${error.message}`;

        if (error.message.includes('500')) {
            mensagemErro = "Erro interno do servidor. O backend pode estar com problemas. Verifique os logs do servidor.";
        }

        if (error.message.includes('Failed to fetch') || error.message.includes('Network')) {
            mensagemErro = "Não foi possível conectar com o servidor. Verifique se o backend está rodando.";
        }
        
        mensagem.textContent = mensagemErro;
        mensagem.className = "mensagem erro";

        mostrarDadosExemplo();
    }
}

function preencherResumo(data) {
    console.log("📋 Preenchendo resumo com:", data);
    
    const campos = {
        'card-ativas': data.active ?? 0,
        'card-aguardando': data.waiting ?? 0,
        'card-atendimento': data.progressing ?? 0,
        'card-resolvidas': data.solved ?? 0,
        'card-encerradas': data.unsolved ?? 0,
        'card-fechadas': data.closed ?? 0
    };

    for (const [id, valor] of Object.entries(campos)) {
        const elemento = document.getElementById(id);
        if (elemento) {
            const texto = elemento.textContent.split(':')[0] + `: ${valor}`;
            elemento.textContent = texto;
        }
    }
}

function criarGraficos(data) {
    console.log("🎨 Criando gráficos com:", data);

    const processarDados = (dados) => {
        if (!Array.isArray(dados)) return { labels: [], valores: [] };
        
        const labels = [];
        const valores = [];
        
        dados.forEach(item => {
            if (item.key !== undefined && item.value !== undefined) {
                labels.push(formatarLabel(item.key));
                valores.push(item.value);
            } else {
                const entries = Object.entries(item);
                if (entries.length > 0) {
                    const [key, value] = entries[0];
                    labels.push(formatarLabel(key));
                    valores.push(value);
                }
            }
        });
        
        return { labels, valores };
    };

    const formatarLabel = (label) => {
        if (!label) return "Sem informação";
        return label.toString()
            .replace(/_/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
    };

    const categorias = processarDados(data.byCategory || []);
    const tipos = processarDados(data.byType || []);
    const turmas = processarDados(data.bySchooclass || []);
    const alunos = processarDados(data.byStudent || []);

    console.log("📊 Dados processados:", { categorias, tipos, turmas, alunos });

    const cores = [
        "#ff2770", "#45f3ff", "#ffa500", "#00ff7f", 
        "#9370db", "#ff6347", "#1e90ff", "#00ced1"
    ];

    criarGraficoPizza("grafico-categorias", categorias, cores);
    criarGraficoRosquinha("grafico-tipos", tipos, cores);
    criarGraficoBarras("grafico-turmas", turmas, "Turma");
    criarGraficoBarras("grafico-alunos", alunos, "Aluno");
}

function criarGraficoPizza(canvasId, dados, cores) {
    const canvas = document.getElementById(canvasId);
    const semDadosElement = document.getElementById(`sem-dados-${canvasId.split('-')[1]}`);
    
    if (!canvas) return;
    
    if (dados.labels.length === 0) {
        if (semDadosElement) semDadosElement.style.display = 'block';
        return;
    }
    
    if (semDadosElement) semDadosElement.style.display = 'none';

    const chartInstance = Chart.getChart(canvas);
    if (chartInstance) chartInstance.destroy();

    new Chart(canvas, {
        type: "pie",
        data: {
            labels: dados.labels,
            datasets: [{
                data: dados.valores,
                backgroundColor: cores,
                borderColor: "#000",
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#fff', font: { size: 12 } }
                }
            }
        }
    });
}

function criarGraficoRosquinha(canvasId, dados, cores) {
    const canvas = document.getElementById(canvasId);
    const semDadosElement = document.getElementById(`sem-dados-${canvasId.split('-')[1]}`);
    
    if (!canvas) return;
    
    if (dados.labels.length === 0) {
        if (semDadosElement) semDadosElement.style.display = 'block';
        return;
    }
    
    if (semDadosElement) semDadosElement.style.display = 'none';

    const chartInstance = Chart.getChart(canvas);
    if (chartInstance) chartInstance.destroy();

    new Chart(canvas, {
        type: "doughnut",
        data: {
            labels: dados.labels,
            datasets: [{
                data: dados.valores,
                backgroundColor: cores,
                borderColor: "#000",
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#fff', font: { size: 12 } }
                }
            }
        }
    });
}

function criarGraficoBarras(canvasId, dados, labelTipo) {
    const canvas = document.getElementById(canvasId);
    const semDadosElement = document.getElementById(`sem-dados-${canvasId.split('-')[1]}`);
    
    if (!canvas) return;
    
    if (dados.labels.length === 0) {
        if (semDadosElement) semDadosElement.style.display = 'block';
        return;
    }
    
    if (semDadosElement) semDadosElement.style.display = 'none';

    const chartInstance = Chart.getChart(canvas);
    if (chartInstance) chartInstance.destroy();

    new Chart(canvas, {
        type: "bar",
        data: {
            labels: dados.labels,
            datasets: [{
                label: `Ocorrências por ${labelTipo}`,
                data: dados.valores,
                backgroundColor: labelTipo === "Aluno" ? "#ff277088" : "#45f3ff88",
                borderColor: labelTipo === "Aluno" ? "#ff2770" : "#45f3ff",
                borderWidth: 2,
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    ticks: {
                        color: "#fff",
                        maxRotation: 45
                    },
                    grid: { color: "rgba(255,255,255,0.1)" }
                },
                y: {
                    ticks: { color: "#fff" },
                    grid: { color: "rgba(255,255,255,0.1)" },
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    labels: { color: "#fff" }
                }
            }
        }
    });
}

function mostrarDadosExemplo() {
    console.log("🔄 Mostrando dados de exemplo para debug...");

    const campos = {
        'card-ativas': 0,
        'card-aguardando': 0,
        'card-atendimento': 0,
        'card-resolvidas': 0,
        'card-encerradas': 0,
        'card-fechadas': 0
    };

    for (const [id, valor] of Object.entries(campos)) {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.textContent = elemento.textContent.split(':')[0] + `: ${valor}`;
        }
    }

    const semDadosElements = [
        'sem-dados-categorias',
        'sem-dados-tipos', 
        'sem-dados-turmas',
        'sem-dados-alunos'
    ];
    
    semDadosElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = 'block';
            element.textContent = 'Dados indisponíveis - Erro no servidor';
        }
    });
}