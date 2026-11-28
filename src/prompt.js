import {gerarMapa,adicionarSpriteAnimado} from "./mapa.js";
import { STATUS_JOGADOR} from "./constants/personagens.js";

const PISO = 0;
const SAIDA = 1;
const PAREDE = 2;
const INIMIGO = 3;
const JOGADOR = 4;

const FLORESTA = "Floresta";
const CIDADE = "Cidade";
const RUINA = "Ruina";
const MONTANHA = "Montanha";

export const lista_regiao = [FLORESTA,CIDADE,RUINA,MONTANHA];

let botaoModalGeminiSim = document.querySelector("#btn-modal-gemini-sim")
let botaoModalGeminiNao = document.querySelector("#btn-modal-gemini-nao")
let mensagemErroSemChave = document.querySelector("#erro-sem-chave")
let mensagemSucessoGemini = document.querySelector("#mensagem-sucesso")
let animacaoGemini = document.querySelector("#animacao-gemini")
let textoAnimacaoGemini = document.querySelector("#texto-animacao-gemini")

// Impede a geração sem chave: mostra a mensagem de erro abaixo dos botões do modal
function temChaveCadastrada() {
    if (obterChavesGemini().length > 0) return true;

    mensagemErroSemChave.hidden = false;
    return false;
}

// Mostra/esconde a animação da logo do Gemini durante a geração
function exibirAnimacaoGemini(texto) {
    textoAnimacaoGemini.textContent = texto;
    animacaoGemini.hidden = false;
}

function esconderAnimacaoGemini() {
    animacaoGemini.hidden = true;
}

export function cenario_aleatorio(lista_regiao){
    const indice = Math.floor(Math.random() * lista_regiao.length);
    return lista_regiao[indice];
}

function gerar_prompt_mapa(lista_regiao){
    const cenario = cenario_aleatorio(lista_regiao)
    const prompt = `
    Gere um mapa para um jogo de RPG no cenário ${cenario}.

    Crie uma matriz numérica de 10 linhas e 15 colunas,
    seguindo esta legenda:
    ${PISO} = Piso caminhável
    ${SAIDA} = Saída
    ${PAREDE} = Parede intransponível
    ${INIMIGO} = Inimigo
    ${JOGADOR} = Jogador

    REGRAS:
    - A matriz DEVE conter exatamente 1 jogador (${JOGADOR}).
    - A matriz DEVE conter exatamente 1 saída (${SAIDA}).
    - A matriz DEVE conter NO MÁXIMO 4 inimigos (${INIMIGO}).
    - É PROIBIDO gerar um mapa sem inimigos.
    - É PROIBIDO gerar mais de um jogador.
    - É PROIBIDO gerar mais de uma saída.
    - O jogador, a saída e os inimigos devem ocupar posições distintas.
    - Todos os elementos devem ser posicionados em células caminháveis.
    - A quantidade de inimigos deve variar aleatoriamente, respeitando o espaço disponível.
    - Evite concentrar todos os inimigos em uma mesma região.
    - Não coloque paredes nas bordas da matriz. Coloque e distribua-as de forma criativa.

    A descrição deve ter no máximo 3 linhas e resumir
    objetivamente a distribuição do mapa, ajudando a definir
    a posição de obstáculos, inimigos e saída.
    Não escreva narrativas ou textos literários.

    Retorne somente um JSON válido Não utilize blocos Markdown,
    crases ou qualquer texto fora do JSON.
    {
        tipo_cenario : ${cenario},
        descricao : str,
        matriz_mapa : int[][],
        quantidade_inimigos : int
    }
    `
    return prompt;
}

function exibirMapaCarregamento() {
    const container = document.querySelector(".jogo-mapa-container");
    if (!container) return;

    container.innerHTML = "";
    if (typeof inimigos !== "undefined") inimigos.length = 0;
    if (typeof jogadorElemento !== "undefined") jogadorElemento = null;

    const linhas = 10;
    const colunas = 15;
    const linhaJogador = 4;
    const colunaJogador = 7;
    const linhaPontos = 6;
    const colunasPontos = [5, 7, 9];

    for (let i = 0; i < linhas; i++) {
        for (let j = 0; j < colunas; j++) {
            const celula = document.createElement("div");
            celula.classList.add("mapa-celula");

            const ehPonto = i === linhaPontos && colunasPontos.includes(j);
            celula.style.backgroundColor = ehPonto ? "#FFFFFF" : "#31081f";

            if (i === linhaJogador && j === colunaJogador) {
                adicionarSpriteAnimado(celula, "cavaleiro-idle", 2);
            }

            container.appendChild(celula);
        }
    }
}

const TIMEOUT_MAPA_MS = 15000;
const MODELO_GEMINI = "gemini-3.5-flash-lite";

async function chamar_gemini(prompt) {
    exibirMapaCarregamento();
    const API_KEY = proximaChaveGemini();
    const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODELO_GEMINI}:generateContent`;
    try {
        if (!API_KEY) {
            throw new Error("Chave de API não informada.");
        }
        const resposta = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": API_KEY
            },
            signal: AbortSignal.timeout(TIMEOUT_MAPA_MS),
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: prompt
                            }
                        ]
                    }
                ],

                // Força o resultado do prompt ser JSON, com essa exata estrutura:
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: "OBJECT",
                        properties: {
                            tipo_cenario: {
                                type: "STRING"
                            },
                            descricao: {
                                type: "STRING"
                            },
                            matriz_mapa: {
                                type: "ARRAY",
                                items: {
                                    type: "ARRAY",
                                    items: {
                                        type: "INTEGER"
                                    }
                                }
                            },
                            quantidade_inimigos: {
                                type: "INTEGER"
                            }
                        },
                        required: [
                            "tipo_cenario",
                            "descricao",
                            "matriz_mapa",
                            "quantidade_inimigos"
                        ]
                    }
                }
            })
        });
        if (!resposta.ok) {
            throw new Error(
                `Erro HTTP ${resposta.status}: ${await resposta.text()}`
            );
        }
        const dados = await resposta.json();
        const texto = dados.candidates?.[0]?.content?.parts
            ?.map(parte => parte.text ?? "")
            .join("");
            console.log("Sucesso");
        return texto || "O Gemini não retornou um texto.";

    } catch (erro) {
        console.error("Erro ao chamar a API:", erro.message);
        throw erro;
    }    
}

// Gera um mapa com o Gemini (cenario sorteado) e monta a nova tela do mapa.
// Retorna o resultado completo (tipo_cenario, descricao, matriz_mapa) pra
// alimentar a narrativa logo em seguida.
async function gerarMapaGemini(cenarioSorteado = cenario_aleatorio(lista_regiao)) {
    console.log("Resultado do prompt:");

    const texto = gerar_prompt_mapa([cenarioSorteado]);
    const resposta_prompt = await chamar_gemini(texto);

    console.log(resposta_prompt);

    const resultado = JSON.parse(resposta_prompt);
    if (!resultado || !mapaMatrizValida(resultado.matriz_mapa)) {
        throw new Error("Matriz de mapa inválida retornada pelo Gemini.");
    }

    const cenarioFinal = (typeof CORES_REGIOES !== "undefined" && CORES_REGIOES[resultado.tipo_cenario])
        ? resultado.tipo_cenario
        : cenarioSorteado;

    // Gera o mapa no HTML, com a função do mapa.js
    gerarMapa(
        resultado.matriz_mapa,
        cenarioFinal
    );

    return resultado;
}

// Textos de abertura padrão, usados quando a história não é gerada pelo Gemini
const NARRATIVAS_PADRAO = {
    "Floresta": "Você acordou em uma FLORESTA escura, sem saber como chegou ali. Ao seu redor, você vê árvores altas e sombras misteriosas. De repente, você ouve um rugido distante e percebe que não está sozinho.",
    "Cidade": "Você desperta no meio de uma CIDADE abandonada. Prédios em silêncio, ruas vazias e olhos que você sente observando por trás das janelas. Algo se move no fim da avenida.",
    "Ruina": "Você caminha por RUÍNAS de pedra rachadas pelo tempo. Ecos de um império esquecido cercam o caminho, e o barulho de passos que não são os seus chega de dentro das cavernas.",
    "Montanha": "O vento gélido da MONTANHA corta seu rosto enquanto você escala o caminho estreito. Abaixo, o abismo. Acima, criaturas se movem entre as rochas, esperando um passo em falso seu."
};

// Geração padrão: sorteia o cenário, monta o mapa padrão local e
// exibe o texto de abertura correspondente. Tudo sem depender da API.
function gerarMapaPadrao() {
    const cenario = cenario_aleatorio(lista_regiao);
    const matrizPadrao = MAPAS_PADRAO[cenario] || MAPAS_PADRAO[FLORESTA];

    gerarMapa(matrizPadrao.map(linha => [...linha]), cenario);
    exibirNarrativa(NARRATIVAS_PADRAO[cenario]);
}

// Caminho escolhido no modal do botão jogar: mapa e história gerados pelo Gemini.
// Em qualquer falha (sem chave, conexão ou resposta inválida), mostra o erro
// e permanece no modal: só entra no jogo se o Gemini gerar com sucesso.
botaoModalGeminiSim.addEventListener("click", async () => {
    mensagemErroSemChave.hidden = true;
    mensagemSucessoGemini.hidden = true;

    if (!temChaveCadastrada()) return;

    botaoModalGeminiSim.disabled = true; // evita cliques repetidos enquanto a API responde
    botaoModalGeminiNao.disabled = true;
    exibirAnimacaoGemini("Gerando mapa e história...");

    try {
        // Gera primeiro o mapa, depois a história com base no cenário e
        // na descrição devolvidos pelo Gemini
        const resultadoMapa = await gerarMapaGemini();

        try {
            await solicitarNovaNarrativa(
                resultadoMapa.tipo_cenario,
                0,
                resultadoMapa.descricao || ""
            );
        } catch (erroNarrativa) {
            console.warn("Falha na narrativa do Gemini; usando texto padrão.", erroNarrativa);
            exibirNarrativa(NARRATIVAS_PADRAO[resultadoMapa.tipo_cenario]);
        }

        // Mapa e história prontos: fecha o modal e entra na tela do jogo
        entrarNoJogo();
    } catch (erro) {
        console.error("Erro ao gerar o mapa e a história com o Gemini:", erro);
        mensagemErroSemChave.textContent = "Não foi possível gerar o mapa e a história. Verifique sua conexão/chave e tente novamente.";
        mensagemErroSemChave.hidden = false;
    } finally {
        botaoModalGeminiSim.disabled = false;
        botaoModalGeminiNao.disabled = false;
        esconderAnimacaoGemini();
    }
});

// Caminho escolhido no modal do botão jogar: geração padrão, sem o Gemini.
// Mapa padrão local + texto de abertura padrão, tudo sem chamar a API.
botaoModalGeminiNao.addEventListener("click", () => {
    mensagemErroSemChave.hidden = true;
    mensagemSucessoGemini.hidden = true;

    gerarMapaPadrao();

    // Fecha o modal e entra na tela do jogo
    entrarNoJogo();
});

// ============================================================
// Pessoa 8 (Breno Oliveira) — Geração e solicitação de mapa
// ============================================================

// Modelos de mapa padrão para cada cenário (fallback caso não haja chave de API ou conexão)
const MAPAS_PADRAO = {
    "Floresta": [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,4,0,2,2,0,0,0,0,2,2,0,3,0,0],
        [0,0,0,2,2,0,2,2,0,2,2,0,0,0,0],
        [0,0,0,0,0,0,2,2,0,0,0,0,0,0,0],
        [0,2,2,0,0,0,0,0,0,0,0,2,2,0,0],
        [0,2,2,0,3,0,0,0,0,0,0,2,2,0,0],
        [0,0,0,0,0,0,2,2,0,0,0,0,0,0,0],
        [0,0,0,2,2,0,2,2,0,2,2,0,0,0,0],
        [0,3,0,2,2,0,0,0,0,2,2,0,1,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ],
    "Cidade": [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,2,0,0,0,2,0,0,0,2,0,1,0],
        [0,3,0,2,0,3,0,2,0,0,0,2,0,0,0],
        [0,0,0,0,0,0,0,0,0,2,0,0,0,0,0],
        [0,2,2,0,2,2,0,0,0,2,2,0,2,2,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,2,0,0,0,2,2,0,2,2,0,0,0,2,0],
        [0,2,0,3,0,0,0,0,0,0,0,3,0,2,0],
        [0,4,0,2,0,0,0,2,0,0,0,2,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ],
    "Ruina": [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,2,2,0,0,0,0,2,2,0,4,0,0],
        [0,3,0,2,2,0,2,2,0,2,2,0,0,0,0],
        [0,0,0,0,0,0,2,2,0,0,0,0,0,0,0],
        [0,2,2,0,0,0,0,0,0,0,0,2,2,0,0],
        [0,2,2,0,0,0,3,0,0,0,0,2,2,0,0],
        [0,0,0,0,0,0,2,2,0,0,0,0,0,0,0],
        [0,0,0,2,2,0,2,2,0,2,2,0,3,0,0],
        [0,1,0,2,2,0,0,0,0,2,2,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ],
    "Montanha": [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,1,0,0,0,2,0,0,0,2,0,0,0,0,0],
        [0,0,0,2,0,2,0,3,0,2,0,2,0,0,0],
        [0,2,0,2,0,0,0,0,0,0,0,2,0,2,0],
        [0,0,0,0,0,2,2,0,2,2,0,0,0,0,0],
        [0,0,3,0,0,2,2,0,2,2,0,0,3,0,0],
        [0,2,0,2,0,0,0,0,0,0,0,2,0,2,0],
        [0,0,0,2,0,2,0,0,0,2,0,2,0,0,0],
        [0,0,0,0,0,2,0,0,0,2,0,0,0,4,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ]
};

/** Valida se a matriz possui dimensões válidas, jogador e saída. */
function mapaMatrizValida(matriz) {
    if (!Array.isArray(matriz) || matriz.length === 0) return false;
    let temJogador = false;
    let temSaida = false;
    for (const linha of matriz) {
        if (!Array.isArray(linha) || linha.length === 0) return false;
        if (linha.includes(JOGADOR)) temJogador = true;
        if (linha.includes(SAIDA)) temSaida = true;
    }
    return temJogador && temSaida;
}

/** Retorna uma cópia de um dos mapas padrão locais para o cenário informado. */
function obterMapaPadrao(cenario) {
    const cenarioValido = MAPAS_PADRAO[cenario] ? cenario : FLORESTA;
    return {
        matriz_mapa: MAPAS_PADRAO[cenarioValido].map(linha => [...linha]),
        tipo_cenario: cenarioValido
    };
}

// Retorna o próximo cenário aleatório, preferencialmente diferente do cenário atual
function obterProximoCenario(cenarioAtual) {
    const opcoes = lista_regiao.filter(r => r !== cenarioAtual);
    if (opcoes.length === 0) return cenario_aleatorio(lista_regiao);
    const indice = Math.floor(Math.random() * opcoes.length);
    return opcoes[indice];
}

// Solicita um novo mapa: via Gemini (se houver chave cadastrada) ou via mapa padrão local
export async function solicitarNovoMapa(cenario) {
    const temChave = obterChavesGemini().length > 0;

    if (temChave) {
        try {
            console.log(`Gerando mapa para: ${cenario}`);
            const prompt = gerar_prompt_mapa([cenario]);
            const respostaPrompt = await chamar_gemini(prompt);
            const resultado = JSON.parse(respostaPrompt);

            if (resultado && mapaMatrizValida(resultado.matriz_mapa)) {
                return {
                    matriz_mapa: resultado.matriz_mapa,
                    tipo_cenario: cenario
                };
            }
        } catch (erro) {
            console.warn("Erro ao gerar mapa, usando mapa padrão.", erro);
        }
    }

    // Fallback local se não houver chave ou requisição falhar
    return obterMapaPadrao(cenario);
}

// ============================================================
// NARRATIVA (Guilherme) — continuidade entre cenários, chefe e fallback.
// O estado e os prompts ficam na classe Narrativa (src/classes/Narrativa.js);
// aqui ficam a chamada à API, a exibição na tela e a ligação com o resto do jogo.
// ============================================================

// Mesmo modelo usado na geração do mapa.
const MODELO_NARRATIVA = "gemini-2.5-flash-lite";

// Tempo máximo de espera pela API; passou disso, usa o fallback.
const TIMEOUT_NARRATIVA_MS = 15000;

// Narrativa da partida atual (criada em iniciarNarrativa).
let narrativa = null;

// Cria a narrativa para o jogador. A classe é carregada com import() dinâmico porque os
// scripts do index.html são clássicos (sem type="module") e não aceitam "import" estático.
// "dadosSalvos" é o objeto vindo do Firebase (resultado de narrativa.exportar()), se houver.
async function iniciarNarrativa(jogador, dadosSalvos = null) {
    const { Narrativa } = await import("./classes/Narrativa.js");
    narrativa = new Narrativa(jogador);
    if (dadosSalvos) narrativa.restaurar(dadosSalvos);
    return narrativa;
}

// Garante que a narrativa exista antes de gerar um texto.
// TEMPORÁRIO: usa um jogador provisório até o jogo criar o Jogador real e chamar iniciarNarrativa().
async function garantirNarrativa() {
    if (narrativa)
        return narrativa;
    
    const { Jogador } = await import("./classes/Jogador.js");
    
    // Correção do valores fixos, agora é utilizado dados do arquivo de contantes.
    return iniciarNarrativa(new Jogador(
        STATUS_JOGADOR.nome,
        STATUS_JOGADOR.vida,
        STATUS_JOGADOR.forca,
        STATUS_JOGADOR.defesa,
        STATUS_JOGADOR.velocidade,
        STATUS_JOGADOR.nivel
    ));
}

// Chamada ao Gemini que retorna TEXTO SIMPLES.
// (a chamar_gemini() do mapa força um schema JSON de mapa, então não serve aqui)
async function chamar_gemini_texto(prompt) {
    const API_KEY = proximaChaveGemini();
    if (!API_KEY) throw new Error("Nenhuma chave da API do Gemini cadastrada nas configurações.");

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODELO_GEMINI}:generateContent`;

    const resposta = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": API_KEY
        },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.9,
            }
        }),
        signal: AbortSignal.timeout(TIMEOUT_NARRATIVA_MS)
    });

    if (!resposta.ok) {
        throw new Error(`Erro HTTP ${resposta.status}: ${await resposta.text()}`);
    }

    const dados = await resposta.json();
    return dados.candidates?.[0]?.content?.parts
        ?.map(parte => parte.text ?? "")
        .join("") ?? "";
}

// Mostra o texto na área de narrativa da tela (.jogo-narrativa).
function exibirNarrativa(texto) {
    const elemento = document.querySelector(".jogo-narrativa");
    if (elemento) elemento.textContent = texto;
}

// Gera (ou recupera do fallback) a narrativa do cenário atual, guarda no histórico e exibe.
// Chame DEPOIS de gerar o mapa, passando tipo_cenario e descricao que o Gemini devolveu.
// forcarFallback: use true para pular a API e usar direto um texto de fallback.
// Retorna { texto, ehChefe, usouFallback, regiaoFallback }.
async function gerarNarrativa({ tipoCenario = "Floresta", descricaoMapa = "", forcarFallback = false } = {}) {
    if (!narrativa) throw new Error("Chame iniciarNarrativa(jogador) antes de gerarNarrativa().");

    // Todo cenário depois do primeiro conta como uma transição (e define se é chefe).
    if (!narrativa.ehInicio) narrativa.registrarTransicao();

    // Evita que o texto fixo do HTML (ou o anterior) apareça enquanto a IA responde.
    exibirNarrativa("O narrador está escrevendo...");

    const ehChefe = narrativa.proximoCenarioEhChefe;
    let texto = "";
    let usouFallback = false;
    let regiaoFallback = null;

    try {
        if (forcarFallback) throw new Error("Fallback solicitado.");

        let prompt;
        if (ehChefe)                 prompt = narrativa.gerarPromptChefe({ tipoCenario, descricaoMapa });
        else if (narrativa.ehInicio) prompt = narrativa.gerarPromptInicial(tipoCenario, descricaoMapa);
        else                         prompt = narrativa.gerarPromptContinuacao({ tipoCenario, descricaoMapa });

        texto = narrativa.limparTexto(await chamar_gemini_texto(prompt));
        if (!texto) throw new Error("A API retornou uma narrativa vazia.");
    } catch (erro) {
        console.warn("Narrativa: usando texto de fallback.", erro);
        const fallback = narrativa.obterFallback(ehChefe, tipoCenario);
        texto = fallback.texto;
        regiaoFallback = fallback.regiao;
        usouFallback = true;
    }

    narrativa.registrarTrecho(texto);
    exibirNarrativa(texto);

    return { texto, ehChefe, usouFallback, regiaoFallback };
}

// ------------------------------------------------------------

// Gera a narrativa do cenário atual e mostra na tela do jogo.
// "descricaoMapa" é a descricao que o Gemini devolve junto com o mapa (opcional).
// "mapasVisitados" não é mais usado: a Narrativa conta as transições sozinha.
export async function solicitarNovaNarrativa(cenario, mapasVisitados, descricaoMapa = "") {
    await garantirNarrativa();
    const { texto } = await gerarNarrativa({ tipoCenario: cenario, descricaoMapa });
    return texto;
}
