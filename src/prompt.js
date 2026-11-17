const PISO = 0;
const SAIDA = 1;
const PAREDE = 2;
const INIMIGO = 3;
const JOGADOR = 4;

const FLORESTA = "Floresta";
const CIDADE = "Cidade";
const RUINA = "Ruina";
const MONTANHA = "Montanha";

const lista_regiao = [FLORESTA,CIDADE,RUINA,MONTANHA];

let botaoGeminiMapa = document.querySelector(".testar-prompt-mapa")
let inputChaveAPI = document.querySelector(".chave-api")

function cenario_aleatorio(lista_regiao){
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
    - A matriz DEVE conter NO MÍNIMO 1 inimigo (${INIMIGO}), podendo conter vários.
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

async function chamar_gemini(prompt) {
    //para testes lembre-se de trocar
    // const API_KEY = "Chave";
    const API_KEY = document.querySelector(".chave-api").value;
    const MODELO = "gemini-3.5-flash";
    const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODELO}:generateContent`;
    try {
        const resposta = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": API_KEY
            },
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

// Botão temporário pra testar a criação do mapa, depois será uma função propria
botaoGeminiMapa.addEventListener("click", async function() {
    console.log("Resultado do prompt:");

    const texto = gerar_prompt_mapa(lista_regiao);
    const resposta_prompt = await chamar_gemini(texto);

    console.log(resposta_prompt);

    const resultado = JSON.parse(resposta_prompt);

    // Gera o mapa no HTML, com a função do mapa.js
    gerarMapa(
        resultado.matriz_mapa,
        resultado.tipo_cenario
    );
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

// Retorna o próximo cenário aleatório, preferencialmente diferente do cenário atual
function obterProximoCenario(cenarioAtual) {
    const opcoes = lista_regiao.filter(r => r !== cenarioAtual);
    if (opcoes.length === 0) return cenario_aleatorio(lista_regiao);
    const indice = Math.floor(Math.random() * opcoes.length);
    return opcoes[indice];
}

// Solicita um novo mapa: via Gemini (se chave fornecida) ou via mapa padrão local
async function solicitarNovoMapa(cenario) {
    const inputChave = document.querySelector(".chave-api");
    const temChave = inputChave && inputChave.value.trim().length > 0;

    if (temChave) {
        try {
            console.log(`[Pessoa 8] Solicitando novo mapa via Gemini para o cenário: ${cenario}...`);
            const prompt = gerar_prompt_mapa([cenario]);
            const respostaPrompt = await chamar_gemini(prompt);
            const resultado = JSON.parse(respostaPrompt);

            if (resultado && resultado.matriz_mapa && Array.isArray(resultado.matriz_mapa)) {
                return {
                    matriz_mapa: resultado.matriz_mapa,
                    tipo_cenario: cenario
                };
            }
        } catch (erro) {
            console.warn("[Pessoa 8] Falha ao gerar mapa via Gemini. Usando mapa local de fallback.", erro);
        }
    }

    // Fallback local se não houver chave ou requisição falhar
    const matriz = MAPAS_PADRAO[cenario] || MAPAS_PADRAO["Floresta"];
    return {
        matriz_mapa: matriz.map(linha => [...linha]),
        tipo_cenario: cenario
    };
}

// ============================================================
// NARRATIVA (Guilherme) — continuidade entre cenários, chefe e fallback.
// O estado e os prompts ficam na classe Narrativa (src/classes/Narrativa.js);
// aqui ficam a chamada à API, a exibição na tela e a ligação com o resto do jogo.
// ============================================================

// Mesmo modelo usado na geração do mapa.
const MODELO_NARRATIVA = "gemini-3.5-flash";

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
    if (narrativa) return narrativa;
    const { Jogador } = await import("./classes/Jogador.js");
    return iniciarNarrativa(new Jogador("Aventureiro", 100, 10, 5, 1));
}

// Chamada ao Gemini que retorna TEXTO SIMPLES.
// (a chamar_gemini() do mapa força um schema JSON de mapa, então não serve aqui)
async function chamar_gemini_texto(prompt) {
    const API_KEY = (document.querySelector(".chave-api")?.value ?? "").trim();
    if (!API_KEY) throw new Error("Chave de API não informada.");

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODELO_NARRATIVA}:generateContent`;

    const resposta = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": API_KEY
        },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.9 }
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

// Ponto de entrada da narrativa para o resto do jogo (mantém o nome que o código do mapa já usava).
// Já exibe o texto na tela, com animação, e também o retorna.
// "descricaoMapa" é a descricao que o Gemini devolve junto com o mapa (opcional).
// "mapasVisitados" não é mais usado: a Narrativa conta as transições sozinha.
async function solicitarNovaNarrativa(cenario, mapasVisitados, descricaoMapa = "") {
    await garantirNarrativa();
    const { texto } = await gerarNarrativa({ tipoCenario: cenario, descricaoMapa });
    return texto;
}

// ------------------------------------------------------------
// BOTÃO DE TESTE DA NARRATIVA — TEMPORÁRIO.
// Criado por JavaScript, ao lado do botão do mapa (o index.html não muda).
// Remover quando a transição de cenário chamar solicitarNovaNarrativa().
// ------------------------------------------------------------
function criarBotaoTesteNarrativa() {
    const botaoMapa = document.querySelector(".testar-prompt-mapa");
    if (!botaoMapa) return;

    const botao = document.createElement("button");
    botao.classList.add("testar-narrativa");
    botao.textContent = "Gerar Narrativa com Gemini";
    botaoMapa.insertAdjacentElement("afterend", botao);

    botao.addEventListener("click", async () => {
        botao.disabled = true; // evita cliques repetidos enquanto a API responde

        try {
            // Usa a região do mapa que está na tela (guardada pelo painel-jogador.js).
            // Se não existir, sorteia uma.
            const regiao = (typeof dadosLocalizacao !== "undefined" && dadosLocalizacao.regiao)
                ? dadosLocalizacao.regiao
                : cenario_aleatorio(lista_regiao);

            const texto = await solicitarNovaNarrativa(regiao, 0, "Cenário de teste, sem mapa associado.");
            console.log("Narrativa gerada:", texto);
        } catch (erro) {
            console.error("Erro ao gerar narrativa:", erro);
        } finally {
            botao.disabled = false;
        }
    });
}

criarBotaoTesteNarrativa();