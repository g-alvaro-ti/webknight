// ============================================================
// painel-jogador.js  —  src/painel_informacoes/
// Painel lateral esquerdo + colapso em telas pequenas.
// ============================================================

// ---- Dados de exemplo (serão substituídos pela classe Jogador futuramente) ----
const dadosJogador = {
    vida:       { atual: 80, max: 100 },
    forca:      { atual: 45, max: 100 },
    defesa:     { atual: 60, max: 100 },
    velocidade: { atual: 70, max: 100 }
};

// ---- Dados de localização de exemplo ----
const dadosLocalizacao = {
    regiao:         "Floresta",
    mapasVisitados: 1
};

// ============================================================
// CRIAÇÃO DOS ELEMENTOS
// ============================================================

function criarPainelJogador() {
    const telaJogo = document.querySelector("#tela-jogo");
    if (!telaJogo) return;

    // ---- Botão minimalista de expandir (só visível em telas pequenas) ----
    const btnToggle = document.createElement("button");
    btnToggle.id    = "painel-btn-toggle";
    btnToggle.title = "Abrir informações do jogador";
    btnToggle.textContent = "❯";
    btnToggle.addEventListener("click", expandirPainel);
    telaJogo.appendChild(btnToggle);

    // ---- Painel lateral ----
    const painel = document.createElement("div");
    painel.id = "painel-jogador";
    // Começa oculto; ajustarLayoutPainel() decide se o exibe ou não
    painel.classList.add("painel-oculto");

    painel.innerHTML = `
        <!-- Botão de recolher (visível apenas em telas pequenas) -->
        <button id="painel-btn-colapsar" title="Recolher painel">❮</button>

        <!-- Card: Atributos do jogador -->
        <div class="painel-card" id="painel-card-atributos">
            <div class="painel-titulo">⚔ Jogador</div>

            <div class="painel-atributo">
                <div class="painel-atributo-label">❤ Vida</div>
                <div class="painel-barra-fundo">
                    <div class="painel-barra-preenchimento painel-barra-vida" id="barra-vida"></div>
                </div>
                <div class="painel-atributo-valor" id="valor-vida"></div>
            </div>

            <div class="painel-atributo">
                <div class="painel-atributo-label">⚔ Força</div>
                <div class="painel-barra-fundo">
                    <div class="painel-barra-preenchimento painel-barra-forca" id="barra-forca"></div>
                </div>
                <div class="painel-atributo-valor" id="valor-forca"></div>
            </div>

            <div class="painel-atributo">
                <div class="painel-atributo-label">🛡 Defesa</div>
                <div class="painel-barra-fundo">
                    <div class="painel-barra-preenchimento painel-barra-defesa" id="barra-defesa"></div>
                </div>
                <div class="painel-atributo-valor" id="valor-defesa"></div>
            </div>

            <div class="painel-atributo">
                <div class="painel-atributo-label">💨 Velocidade</div>
                <div class="painel-barra-fundo">
                    <div class="painel-barra-preenchimento painel-barra-velocidade" id="barra-velocidade"></div>
                </div>
                <div class="painel-atributo-valor" id="valor-velocidade"></div>
            </div>
        </div>

        <!-- Card: Localização -->
        <div class="painel-card" id="painel-card-localizacao">
            <div class="painel-titulo">🗺 Localização</div>
            <div class="painel-localizacao-info">
                <div class="painel-info-linha">
                    <span class="painel-info-chave">Região</span>
                    <span class="painel-info-valor" id="painel-regiao">—</span>
                </div>
                <div class="painel-info-linha">
                    <span class="painel-info-chave">Mapas</span>
                    <span class="painel-info-valor" id="painel-mapas-visitados">—</span>
                </div>
            </div>
        </div>
    `;

    telaJogo.appendChild(painel);

    // Vincula o botão de recolher após o painel existir no DOM
    document.getElementById("painel-btn-colapsar").addEventListener("click", colapsarPainel);
}

// ============================================================
// EXPANDIR / RECOLHER
// ============================================================

function expandirPainel() {
    const painel      = document.getElementById("painel-jogador");
    const btnToggle   = document.getElementById("painel-btn-toggle");
    const btnColapsar = document.getElementById("painel-btn-colapsar");
    if (!painel) return;

    painel.classList.remove("painel-oculto");
    btnToggle.classList.remove("visivel");
    btnColapsar.classList.add("visivel");
}

function colapsarPainel() {
    const painel      = document.getElementById("painel-jogador");
    const btnToggle   = document.getElementById("painel-btn-toggle");
    const btnColapsar = document.getElementById("painel-btn-colapsar");
    if (!painel) return;

    painel.classList.add("painel-oculto");
    btnToggle.classList.add("visivel");
    btnColapsar.classList.remove("visivel");
}

// ============================================================
// AJUSTE RESPONSIVO
// Acima de BREAKPOINT_PAINEL → painel sempre visível, sem botões.
// Abaixo de BREAKPOINT_PAINEL → painel pode colidir com o mapa;
//   colapsa para o botão minimalista e o usuário controla.
// ============================================================

// Largura mínima da seção para o painel não sobrepor o mapa centralizado.
// Mapa: 736px. Painel: ~185px a partir da esquerda.
// Espaço à esquerda do mapa = (sectionWidth - 736) / 2 >= 185 + 10px gap → ~1130px.
const BREAKPOINT_PAINEL = 1130;

// Rastreia se a tela era grande no ciclo anterior (detecta transição grande→pequena)
let _eraGrande = null;

function ajustarLayoutPainel() {
    const painel      = document.getElementById("painel-jogador");
    const btnToggle   = document.getElementById("painel-btn-toggle");
    const btnColapsar = document.getElementById("painel-btn-colapsar");
    const telaJogo    = document.querySelector("#tela-jogo");
    if (!painel || !btnToggle || !btnColapsar || !telaJogo) return;

    const telaPequena = telaJogo.clientWidth < BREAKPOINT_PAINEL;

    if (!telaPequena) {
        // Tela grande: painel sempre visível, sem botões de toggle
        painel.classList.remove("painel-oculto");
        btnToggle.classList.remove("visivel");
        btnColapsar.classList.remove("visivel");
        _eraGrande = true;
    } else {
        // Tela pequena:
        // — Se acabou de encolher (transição grande→pequena), auto-colapsa
        if (_eraGrande === true) {
            painel.classList.add("painel-oculto");
        }

        // Sincroniza visibilidade dos botões com o estado do painel
        const oculto = painel.classList.contains("painel-oculto");
        btnToggle.classList.toggle("visivel",   oculto);
        btnColapsar.classList.toggle("visivel", !oculto);

        _eraGrande = false;
    }
}

// Observa mudanças de tamanho no #tela-jogo
const _resizeObserverPainel = new ResizeObserver(ajustarLayoutPainel);
const _telaJogoEl = document.querySelector("#tela-jogo");
if (_telaJogoEl) _resizeObserverPainel.observe(_telaJogoEl);

// ============================================================
// ATUALIZAÇÃO DE DADOS
// ============================================================

// ---- Atualiza os atributos do jogador no painel ----
function atualizarAtributosJogador(dados) {
    const atributos = ["vida", "forca", "defesa", "velocidade"];

    atributos.forEach(attr => {
        if (!dados[attr]) return;

        const { atual, max } = dados[attr];
        const porcentagem = Math.min(100, Math.max(0, (atual / max) * 100));

        const barra = document.getElementById(`barra-${attr}`);
        const valor = document.getElementById(`valor-${attr}`);

        if (barra) barra.style.width  = `${porcentagem}%`;
        if (valor) valor.textContent  = `${atual} / ${max}`;
    });
}

// ---- Atualiza a localização no painel ----
function atualizarLocalizacao(dados) {
    const elRegiao = document.getElementById("painel-regiao");
    const elMapas  = document.getElementById("painel-mapas-visitados");

    if (elRegiao && dados.regiao !== undefined)
        elRegiao.textContent = dados.regiao;

    if (elMapas && dados.mapasVisitados !== undefined)
        elMapas.textContent = dados.mapasVisitados;
}

// ---- Função principal: atualiza TODO o painel de uma vez ----
// Chame sempre que jogador ou localização mudarem.
// Parâmetros opcionais; se omitidos, usa os dados internos de exemplo.
function atualizarPainelJogador(novosDadosJogador, novosDadosLocalizacao) {
    if (novosDadosJogador)     Object.assign(dadosJogador,     novosDadosJogador);
    if (novosDadosLocalizacao) Object.assign(dadosLocalizacao, novosDadosLocalizacao);

    atualizarAtributosJogador(dadosJogador);
    atualizarLocalizacao(dadosLocalizacao);
}

// ---- Notifica o painel quando um novo mapa é gerado ----
// Deve ser chamada por gerarMapa() em mapa.js
function notificarMudancaMapa(novaRegiao) {
    dadosLocalizacao.mapasVisitados += 1;
    if (novaRegiao) dadosLocalizacao.regiao = novaRegiao;
    atualizarLocalizacao(dadosLocalizacao);
}

// ============================================================
// INICIALIZAÇÃO
// ============================================================
criarPainelJogador();
atualizarPainelJogador();
ajustarLayoutPainel(); // aplica o layout correto já no carregamento
