const mapaContainer = document.querySelector(".jogo-mapa-container");

let jogadorElemento = null;
let jogadorPosicao  = { linha: 0, coluna: 0 };
let direcaoAtual = "baixo";  
let timerAndar   = null;     

const LINHAS = 10;
const COLUNAS = 15;

// Estado dos inimigos presentes no mapa (posição + elemento do sprite),
// mantido aqui pra não perder eles a cada tela gerada
const inimigos = [];

// Chance do inimigo permanecer parado em vez de tentar se movimentar
const CHANCE_INIMIGO_PARADO = 0.3;

// Direções possíveis que um inimigo pode tomar (sem diagonais)
const DIRECOES_INIMIGO = [
    { dx:  0, dy: -1 }, // Cima
    { dx:  0, dy:  1 }, // Baixo
    { dx: -1, dy:  0 }, // Esquerda
    { dx:  1, dy:  0 }  // Direita
];

const SPRITE_PLAYER = "assets/sprites/Soldier_Idle1.png"
const SPRITE_DEMON = "assets/sprites/Demon_A_Idle1.png"
const OBJECT_TREE = "assets/sprites/object-tree.png"
const TEXTURE_1 = "assets/sprites/texture.png"
const TEXTURE_2 = "assets/sprites/texture2.png"

const CORES_REGIOES = {
    "Floresta": {
        0: "#558c3b", // Piso
        1: "#D9C65B", // Saída
        2: "#344D2D", // Parede
        3: "#477A3C", // Inimigo (piso)
        4: "#477A3C"  // Jogador (piso)
    },

    "Cidade": {
        0: "#858585",
        1: "#D9C65B",
        2: "#454545",
        3: "#858585",
        4: "#858585"
    },

    "Ruina": {
        0: "#81765D",
        1: "#D9C65B",
        2: "#49443A",
        3: "#81765D",
        4: "#81765D"
    },

    "Montanha": {
        0: "#A6ADB5",
        1: "#D9C65B",
        2: "#59616B",
        3: "#A6ADB5",
        4: "#A6ADB5"
    }
};

const INIMIGOS_REGIOES = {
    "Floresta": "orc-idle",
    "Cidade":   "orc-idle",
    "Ruina":    "monster-idle",
    "Montanha": "demon-idle"
};

// Função para injetar uma imagem estática em uma célula específica
function adicionarCamada(celula, caminhoImagem, ordemZ = 1) {
    const img = document.createElement("img");
    img.src = caminhoImagem;
    img.classList.add("camada-sprite");
    img.style.zIndex = ordemZ;
    celula.appendChild(img);
    return img;
}

// Função pra injetar uma spritesheet (definida em sprites.css) em uma célula
function adicionarSpriteAnimado(celula, classeSprite, ordemZ = 1) {
    const sprite = document.createElement("div");

    sprite.classList.add(
        "camada-sprite",
        "sprite-animado",
        classeSprite
    );

    sprite.style.zIndex = ordemZ;

    celula.appendChild(sprite);

    return sprite;
}

// Move o sprite entre células deixando um fantasma translúcido na célula de origem
function moverSpriteComRastro(sprite, celulaOrigem, celulaDestino, dx = 0, dy = 0) {
    const fantasma = sprite.cloneNode(false);
    fantasma.classList.remove("sprite-passo-transicao");
    fantasma.classList.add("rastro-fantasma");
    fantasma.style.transform = "";
    fantasma.style.zIndex = 1;
    fantasma.style.setProperty("--move-dx", dx);
    fantasma.style.setProperty("--move-dy", dy);

    fantasma.addEventListener("animationend", () => fantasma.remove(), { once: true });
    setTimeout(() => { if (fantasma.isConnected) fantasma.remove(); }, 500);

    celulaOrigem.removeChild(sprite);
    celulaOrigem.appendChild(fantasma);
    celulaDestino.appendChild(sprite);

    sprite.classList.remove("sprite-passo-transicao");
    sprite.style.transform = `translate(calc(${-dx} * var(--cell-size) * 0.3), calc(${-dy} * var(--cell-size) * 0.3))`;
    void sprite.offsetWidth;
    sprite.classList.add("sprite-passo-transicao");
    sprite.style.transform = "translate(0, 0)";
}

const mapa = [];
function gerarMapaVazio(){
for (let i = 0; i < LINHAS; i++) {
    mapa[i] = [];
    for (let j = 0; j < COLUNAS; j++) {
        const celula = document.createElement("div");
        celula.classList.add("mapa-celula");
        
        celula.dataset.linha = i;
        celula.dataset.coluna = j;
        mapa[i][j] = celula;
        mapaContainer.appendChild(celula);
    }
}
}

function gerarMapa(matriz_mapa, tipo_cenario) {
    // Limpa o mapa anterior
    mapaContainer.innerHTML = [];

    // Limpa a matriz de elementos HTML
    mapa.length = 0;

    // Limpa o estado dos inimigos do mapa anterior
    inimigos.length = 0;

    jogadorElemento = null;
    jogadorPosicao  = { linha: 0, coluna: 0 };  

    // Obtém as cores e o sprite de inimigo correspondentes à região
    const cores = CORES_REGIOES[tipo_cenario];
    const classeInimigo = INIMIGOS_REGIOES[tipo_cenario] || "demon-idle";

    if (!cores) {
        console.error("Cenário desconhecido:", tipo_cenario);
        return;
    }

    // Percorre a matriz recebida do Gemini
    for (let i = 0; i < matriz_mapa.length; i++) {

        mapa[i] = [];

        for (let j = 0; j < matriz_mapa[i].length; j++) {

            const valor = matriz_mapa[i][j];

            const celula = document.createElement("div");
            celula.classList.add("mapa-celula");

            celula.dataset.linha = i;
            celula.dataset.coluna = j;

            // Define a aparência conforme o valor da matriz
            switch (valor) {
                case 0: // Piso
                    celula.style.backgroundColor = cores[0];
                    celula.dataset.tipo = "piso"

                    // Coloca uma cor mais escura em pisos aleatórios, com 2 tons diferentes
                    chance_textura = Math.floor(Math.random() * 5);

                    if(chance_textura == 1){
                        adicionarCamada(celula, TEXTURE_1, 2);
                    }else if(chance_textura == 2){
                        adicionarCamada(celula, TEXTURE_2, 2);
                    }

                    break;
                case 1: // Saída
                    celula.style.backgroundColor = cores[1];
                    celula.dataset.tipo = "saida"

                    break;
                case 2: // Parede
                    celula.style.backgroundColor = cores[2];
                    celula.dataset.tipo = "parede"
                    
                    // Adicionando um objeto decorativo
                    // adicionarCamada(celula, OBJECT_TREE, 2);
                    break;
                case 3: // Inimigo
                    celula.style.backgroundColor = cores[3];
                    celula.dataset.tipo = "inimigo"

                    const spriteInimigo = adicionarSpriteAnimado(celula, classeInimigo, 2)

                    // Guarda o inimigo com sua posição e elemento,
                    // pra poder movimentá-lo sem recriar o sprite depois
                    inimigos.push({
                        linha: i,
                        coluna: j,
                        elemento: spriteInimigo
                    });

                    break;
                case 4: // Jogador
                    celula.style.backgroundColor = cores[4];
                    celula.dataset.tipo = "piso"

                    jogadorElemento = adicionarSpriteAnimado(celula, "cavaleiro-idle", 2)
                    jogadorPosicao  = { linha: i, coluna: j };
                    break;
                default:
                    console.error(`Valor inválido na posição [${i}][${j}]:`, valor);
                    celula.style.backgroundColor = "#FF00FF";
                    break;
            }

            // Adiciona a célula na matriz, pra poder ser acessada depois
            mapa[i][j] = celula;
            mapaContainer.appendChild(celula);
        }
    }
    // Notifica o painel que o mapa foi totalmente gerado,
    // atualizando a região exibida e incrementando o contador de mapas visitados.
    if (typeof notificarMudancaMapa === "function") notificarMudancaMapa(tipo_cenario);

    // Atualiza a indicação de localização na tela do jogo
    const elLocalizacao = document.querySelector(".jogo-localizacao");
    if (elLocalizacao) elLocalizacao.textContent = tipo_cenario;
}

// Teste para sempre carregar a página com um mapa padrão,
// com piso, paredes, jogador, inimigos e saída
// pra evitar de usar a API o tempo todo durante o desenvolvimento
let mapaTestePadrao = true
// Pro cenário ser aleatório toda vez que recarregar a página
let cenarioAleatorio = false

if(mapaTestePadrao == true){
    const matrizTeste = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,4,0,2,2,0,0,0,0,2,2,0,3,0,0],[0,0,0,2,2,0,2,2,0,2,2,0,0,0,0],[0,0,0,0,0,0,2,2,0,0,0,0,0,0,0],[0,2,2,0,0,0,0,0,0,0,0,2,2,0,0],[0,2,2,0,3,0,0,0,0,0,0,2,2,0,0],[0,0,0,0,0,0,2,2,0,0,0,0,0,0,0],[0,0,0,2,2,0,2,2,0,2,2,0,0,0,0],[0,3,0,2,2,0,0,0,0,2,2,0,1,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]
    if(cenarioAleatorio){
        gerarMapa(matrizTeste, cenario_aleatorio(lista_regiao))
    }else{
        gerarMapa(matrizTeste, "Floresta")
    }
}

function moverJogador(dx, dy) {
    if (carregandoMapa) return false;
    if (!jogadorElemento) return false;

    const novaLinha  = jogadorPosicao.linha  + dy;
    const novaColuna = jogadorPosicao.coluna + dx;

    if (novaLinha  < 0 || novaLinha  >= LINHAS)  return false;
    if (novaColuna < 0 || novaColuna >= COLUNAS) return false;

    const celulaDestino = mapa[novaLinha][novaColuna];

    if (celulaDestino.dataset.tipo === "parede") return false;

    const eraInimigo = celulaDestino.dataset.tipo === "inimigo";
    const eraSaida   = celulaDestino.dataset.tipo === "saida";

    if (dy < 0) direcaoAtual = "cima";
    if (dy > 0) direcaoAtual = "baixo";
    if (dx < 0) direcaoAtual = "esquerda";
    if (dx > 0) direcaoAtual = "direita";

    const celulaAtual = mapa[jogadorPosicao.linha][jogadorPosicao.coluna];
    moverSpriteComRastro(jogadorElemento, celulaAtual, celulaDestino, dx, dy);

    jogadorPosicao = { linha: novaLinha, coluna: novaColuna };

    // Todos os inimigos tentam se movimentar após o jogador se mover
    moverInimigos();


    jogadorElemento.classList.remove("cavaleiro-idle");
    jogadorElemento.classList.remove(
        "cavaleiro-walk-baixo",
        "cavaleiro-walk-cima",
        "cavaleiro-walk-esquerda",
        "cavaleiro-walk-direita"
    );
    jogadorElemento.classList.add("cavaleiro-walk", `cavaleiro-walk-${direcaoAtual}`);


    clearTimeout(timerAndar);
    timerAndar = setTimeout(() => {
        if (!jogadorElemento) return;

 
        jogadorElemento.classList.remove(
            "cavaleiro-walk",
            "cavaleiro-walk-baixo",
            "cavaleiro-walk-cima",
            "cavaleiro-walk-esquerda",
            "cavaleiro-walk-direita"
        );
        jogadorElemento.classList.add("cavaleiro-idle");
    }, 200);

    // Pessoa 8 (Breno Oliveira) — Detecção de encontros com inimigo e alcance da saída
    if (eraInimigo) {
        detectarEncontroInimigo(novaLinha, novaColuna, celulaDestino);
    } else if (eraSaida) {
        detectarSaida(novaLinha, novaColuna);
    }

    return true;
}

// Verifica se a célula destino pode ser ocupada por um inimigo,
// bloqueando paredes, os limites do mapa, outros inimigos e o próprio jogador
function podeMoverInimigo(linha, coluna) {
    if (linha  < 0 || linha  >= LINHAS)  return false;
    if (coluna < 0 || coluna >= COLUNAS) return false;

    const tipoCelula = mapa[linha][coluna].dataset.tipo;
    if (tipoCelula === "parede" || tipoCelula === "inimigo" || tipoCelula === "saida") return false;

    // O inimigo pode pisar na célula do jogador
    if (linha === jogadorPosicao.linha && coluna === jogadorPosicao.coluna) return true;

    return true;
}

// Sorteia um movimento aleatório pra cada inimigo do mapa,
// com chance de permanecer parado, e já move o sprite pra célula destino
function moverInimigos() {
    for (const inimigo of inimigos) {
        // Chance de permanecer parado neste turno
        if (Math.random() < CHANCE_INIMIGO_PARADO) continue;

        // Calcula a distância entre o inimigo e o jogador
        const diferencaLinha = jogadorPosicao.linha - inimigo.linha;
        const diferencaColuna = jogadorPosicao.coluna - inimigo.coluna;

        // Descobre quais direções aproximam o inimigo do jogador
        const direcoesValidas = [];

        if (diferencaLinha < 0) {
            direcoesValidas.push({ dx: 0, dy: -1 });
        }

        if (diferencaLinha > 0) {
            direcoesValidas.push({ dx: 0, dy: 1 });
        }

        if (diferencaColuna < 0) {
            direcoesValidas.push({ dx: -1, dy: 0 });
        }

        if (diferencaColuna > 0) {
            direcoesValidas.push({ dx: 1, dy: 0 });
        }

        // Remove direções que levam a paredes ou outros inimigos
        const movimentosPossiveis = direcoesValidas.filter(({ dx, dy }) =>
            podeMoverInimigo(
                inimigo.linha + dy,
                inimigo.coluna + dx
            )
        );

        if (movimentosPossiveis.length === 0) continue;

        // Escolhe aleatoriamente uma das direções possíveis
        const { dx, dy } = movimentosPossiveis[
            Math.floor(Math.random() * movimentosPossiveis.length)
        ];

        const novaLinha  = inimigo.linha  + dy;
        const novaColuna = inimigo.coluna + dx;

        const celulaAtual   = mapa[inimigo.linha][inimigo.coluna];
        const celulaDestino = mapa[novaLinha][novaColuna];

        moverSpriteComRastro(inimigo.elemento, celulaAtual, celulaDestino, dx, dy);

        // A célula que o inimigo saiu volta a ser piso e o destino passa a ser inimigo
        celulaAtual.dataset.tipo   = "piso";
        celulaDestino.dataset.tipo = "inimigo";

        // Atualiza o estado do inimigo pra próxima movimentação
        inimigo.linha  = novaLinha;
        inimigo.coluna = novaColuna;

        // Verifica se o inimigo encontrou o jogador, e inicia uma batalha
        if (novaLinha === jogadorPosicao.linha && novaColuna === jogadorPosicao.coluna) {
            detectarEncontroInimigo(novaLinha, novaColuna, mapa[novaLinha][novaColuna]);
            continue;
        }
    }
}


const TECLAS_MOVIMENTO = {
    w:          { dx:  0, dy: -1 },
    s:          { dx:  0, dy:  1 },
    a:          { dx: -1, dy:  0 },
    d:          { dx:  1, dy:  0 },
    arrowup:    { dx:  0, dy: -1 },
    arrowdown:  { dx:  0, dy:  1 },
    arrowleft:  { dx: -1, dy:  0 },
    arrowright: { dx:  1, dy:  0 }
};

const teclasPressionadas = {};      // timestamp de cada tecla (0 = solta)
const filaInputs         = [];      // fila pra não perder toques rápidos
const MAX_FILA           = 3;
const EXPIRACAO_INPUT    = 300;     // ms

let ultimoTempoMovimento = 0;
const DELAY_MOVIMENTO    = 150;     // ms entre passos

// Diagonal: prioriza a tecla pressionada MAIS RECENTEMENTE
function calcularDirecaoSegurada() {
    const ativa = (t) => (teclasPressionadas[t] || 0) > 0;

    const cima     = ativa("w") || ativa("arrowup");
    const baixo    = ativa("s") || ativa("arrowdown");
    const esquerda = ativa("a") || ativa("arrowleft");
    const direita  = ativa("d") || ativa("arrowright");

    let dx = 0, dy = 0;
    if (cima && !baixo)       dy = -1;
    if (baixo && !cima)       dy =  1;
    if (esquerda && !direita) dx = -1;
    if (direita && !esquerda) dx =  1;

    if (dx !== 0 && dy !== 0) {
        const tsH = Math.max(
            dx < 0 ? (teclasPressionadas.a          || 0) : 0,
            dx < 0 ? (teclasPressionadas.arrowleft  || 0) : 0,
            dx > 0 ? (teclasPressionadas.d          || 0) : 0,
            dx > 0 ? (teclasPressionadas.arrowright || 0) : 0
        );
        const tsV = Math.max(
            dy < 0 ? (teclasPressionadas.w          || 0) : 0,
            dy < 0 ? (teclasPressionadas.arrowup    || 0) : 0,
            dy > 0 ? (teclasPressionadas.s          || 0) : 0,
            dy > 0 ? (teclasPressionadas.arrowdown  || 0) : 0
        );
        if (tsH >= tsV) dy = 0;
        else            dx = 0;
    }

    return { dx, dy };
}

function tentarMover() {
    if (carregandoMapa) return;
    if (!jogadorElemento) return;

    const agora = Date.now();
    if (agora - ultimoTempoMovimento < DELAY_MOVIMENTO) return;

    // 1) Fila de toques rápidos
    while (filaInputs.length > 0) {
        const input = filaInputs.shift();
        if (agora - input.criadoEm > EXPIRACAO_INPUT) continue;

        // ✅ só paga cooldown se moveu de fato
        if (moverJogador(input.dx, input.dy)) {
            ultimoTempoMovimento = agora;
        }
        return;
    }

    // 2) Teclas fisicamente seguradas
    const { dx, dy } = calcularDirecaoSegurada();
    if (dx !== 0 || dy !== 0) {
        if (moverJogador(dx, dy)) {
            ultimoTempoMovimento = agora;
        }
    }
}

// Tecla pressionada
document.addEventListener("keydown", (evento) => {
    const tag = evento.target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;

    const tecla = evento.key.toLowerCase();
    const dir = TECLAS_MOVIMENTO[tecla];
    if (!dir) return;

    evento.preventDefault();

    // Ignora auto-repeat do sistema operacional
    if ((teclasPressionadas[tecla] || 0) > 0) return;

    teclasPressionadas[tecla] = Date.now();

    if (filaInputs.length < MAX_FILA) {
        filaInputs.push({ dx: dir.dx, dy: dir.dy, criadoEm: Date.now() });
    }

    tentarMover();
});

// Tecla solta
document.addEventListener("keyup", (evento) => {
    const tag = evento.target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;

    const tecla = evento.key.toLowerCase();
    if (!TECLAS_MOVIMENTO[tecla]) return;

    teclasPressionadas[tecla] = 0;
    evento.preventDefault();
});

// Loop contínuo (para segurar tecla)
setInterval(tentarMover, 16);


// Adicionando spritesheets
// adicionarSpriteAnimado(mapa[0][0], "cavaleiro-idle", 2)
// adicionarSpriteAnimado(mapa[0][2], "demon-idle", 2)
// Adicionando imagens paradas
// adicionarCamada(mapa[1][0], SPRITE_PLAYER, 2);
// adicionarCamada(mapa[1][2], SPRITE_DEMON, 2);

// ============================================================
// Pessoa 8 (Breno Oliveira) — Detecção de encontros e troca de mapas
// ============================================================

let carregandoMapa = false;

// 1. Detectar quando o jogador entra em uma célula com inimigo
// 2. Exibir uma mensagem no console indicando o encontro, sem implementar batalhas
function detectarEncontroInimigo(linha, coluna, celula) {
    console.log(`Encontro com inimigo em [${linha}, ${coluna}]`);
}

// 3. Detectar quando o jogador alcança a saída
function detectarSaida(linha, coluna) {
    console.log(`Saída alcançada em [${linha}, ${coluna}]`);
    trocarDeMapa();
}

// 4. Solicitar um novo mapa e uma nova narrativa
// 5. Atualizar a tela com o novo mapa, preservando as estatísticas da sessão
async function trocarDeMapa() {
    if (carregandoMapa) return;
    carregandoMapa = true;

    // Esvazia fila de movimentos para evitar passos residuais durante o carregamento
    filaInputs.length = 0;

    const cenarioAtual = (typeof dadosLocalizacao !== "undefined" && dadosLocalizacao.regiao)
        ? dadosLocalizacao.regiao
        : "Floresta";

    const proximoCenario = (typeof obterProximoCenario === "function")
        ? obterProximoCenario(cenarioAtual)
        : cenario_aleatorio(lista_regiao);

    const numeroProximoMapa = (typeof dadosLocalizacao !== "undefined" && dadosLocalizacao.mapasVisitados)
        ? dadosLocalizacao.mapasVisitados + 1
        : 2;

    let mapaAtualizado = false;

    try {
        console.log(`Carregando mapa ${numeroProximoMapa} (${proximoCenario})`);

        // Feedback imediato na tela
        const elNarrativa = document.querySelector(".jogo-narrativa");
        if (elNarrativa) {
            elNarrativa.textContent = `Avançando para ${proximoCenario}... Carregando novo mapa e narrativa...`;
        }

        // Dispara narrativa em paralelo, mas atualiza o mapa assim que ele (ou o padrão) responder
        const promessaNarrativa = solicitarNovaNarrativa(proximoCenario, numeroProximoMapa);
        const dadosMapa = await solicitarNovoMapa(proximoCenario);

        gerarMapa(dadosMapa.matriz_mapa, dadosMapa.tipo_cenario);
        mapaAtualizado = true;

        const novaNarrativa = await promessaNarrativa;
        if (elNarrativa && novaNarrativa) {
            elNarrativa.textContent = novaNarrativa;
        }

        console.log(`Novo mapa carregado: ${dadosMapa.tipo_cenario}`);
    } catch (erro) {
        console.error("Erro durante a troca de mapas:", erro);
        if (!mapaAtualizado && typeof obterMapaPadrao === "function") {
            const mapaPadrao = obterMapaPadrao(proximoCenario);
            atualizarTelaComNovoMapa(mapaPadrao.matriz_mapa, mapaPadrao.tipo_cenario);
        }
    } finally {
        carregandoMapa = false;
    }
}

function atualizarTelaComNovoMapa(matrizMapa, tipoCenario, novaNarrativa) {
    // 1. Gera o novo mapa visualmente na tela (recria as células e posiciona o jogador)
    // notificarMudancaMapa() é acionada internamente em gerarMapa(), incrementando mapasVisitados
    // e preservando os atributos do jogador no painel lateral
    gerarMapa(matrizMapa, tipoCenario);

    // 2. Atualiza a narrativa na tela
    const elNarrativa = document.querySelector(".jogo-narrativa");
    if (elNarrativa && novaNarrativa) {
        elNarrativa.textContent = novaNarrativa;
    }

    console.log(`Novo mapa carregado: ${tipoCenario}`);
}
