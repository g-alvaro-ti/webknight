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
// Pessoa 8 (Breno Oliveira) — Geração e solicitação de mapa e narrativa
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

// Narrativas padrão por cenário (fallback caso não haja chave de API ou conexão)
const NARRATIVAS_PADRAO = {
    "Floresta": [
        "Você adentra uma parte mais densa da Floresta. Entre árvores colossais e sombras sinuosas, o arrepio na nuca avisa que novos monstros espreitam na névoa.",
        "A vegetação fica mais fechada e úmida. O som de passos nas folhas secas indica que você não está sozinho nesta clareira da Floresta.",
        "A luz do sol mal penetra a copa da Floresta. O silêncio sepulcral é quebrado apenas pelo rosnado distante de predadores famintos."
    ],
    "Cidade": [
        "Você cruza os portões e alcança as ruas de pedra de uma antiga Cidade. Becos escuros e janelas quebradas escondem criaturas à sua espera.",
        "Edifícios em ruínas cercam a praça desta Cidade abandonada. O eco dos seus passos reverbera pelas vielas silenciosas e perigosas.",
        "A poeira cobre o calçamento desta Cidade esquecida. Sombras rastejam pelos cantos, prontas para emboscar qualquer invasor."
    ],
    "Ruina": [
        "Você penetra nos corredores esquecidos de uma Ruína ancestral. Pilares partidos e runas misteriosas guardam perigos e abominações.",
        "O cheiro de pedra gasta e magia antiga preenche o ar das Ruínas. Olhos reluzentes observam sua aproximação na escuridão.",
        "Antigos templos desmoronados formam um labirinto nesta Ruína sagrada. Criaturas profanas rondam cada corredor."
    ],
    "Montanha": [
        "O vento gélido ruge furioso nos desfiladeiros da Montanha. Trilhas íngremes e precipícios exigem cautela a cada novo passo.",
        "Você sobe por rochedos escarpados na Montanha cinzenta. Criaturas aladas e monstros das cavernas vigiam do alto.",
        "O ar rarefeito congela sua respiração nos picos da Montanha. O terreno acidentado esconde emboscadas mortais."
    ]
};

// Retorna o próximo cenário aleatório, preferencialmente diferente do cenário atual
function obterProximoCenario(cenarioAtual) {
    const opcoes = lista_regiao.filter(r => r !== cenarioAtual);
    if (opcoes.length === 0) return cenario_aleatorio(lista_regiao);
    const indice = Math.floor(Math.random() * opcoes.length);
    return opcoes[indice];
}

// Gera o texto de prompt para solicitar uma nova narrativa ao Gemini
function gerar_prompt_narrativa(cenario, mapasVisitados) {
    return `
    Você é o narrador de um jogo de RPG de aventura medieval e fantasia.
    O herói acabou de encontrar a saída do mapa anterior e entrou em uma nova área: ${cenario}.
    Este é o mapa de número ${mapasVisitados} da sua jornada.

    Escreva uma narrativa curta de 2 a 3 frases (máximo 200 caracteres) em tom imersivo e de suspense sobre a chegada do herói a essa nova região.
    Não use formatações markdown (sem asteriscos, sem negrito, sem hashtags, sem aspas externas).
    Retorne apenas o texto puro da narrativa.
    `;
}

// Chama a API do Gemini para obter texto puro de narrativa
async function chamar_gemini_narrativa(prompt) {
    const inputChave = document.querySelector(".chave-api");
    const API_KEY = inputChave ? inputChave.value.trim() : "";
    if (!API_KEY) {
        throw new Error("Chave de API não informada.");
    }

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
                generationConfig: {
                    maxOutputTokens: 250,
                    temperature: 0.7
                }
            })
        });

        if (!resposta.ok) {
            throw new Error(`Erro HTTP ${resposta.status}: ${await resposta.text()}`);
        }

        const dados = await resposta.json();
        const texto = dados.candidates?.[0]?.content?.parts
            ?.map(parte => parte.text ?? "")
            .join("");

        return (texto || "").replace(/^["']|["']$/g, "").trim();
    } catch (erro) {
        console.error("Erro ao chamar API Gemini para narrativa:", erro);
        throw erro;
    }
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

// Solicita uma nova narrativa: via Gemini (se chave fornecida) ou via narrativa padrão local
async function solicitarNovaNarrativa(cenario, mapasVisitados) {
    const inputChave = document.querySelector(".chave-api");
    const temChave = inputChave && inputChave.value.trim().length > 0;

    if (temChave) {
        try {
            console.log(`[Pessoa 8] Solicitando nova narrativa via Gemini para o cenário: ${cenario}...`);
            const prompt = gerar_prompt_narrativa(cenario, mapasVisitados);
            const resposta = await chamar_gemini_narrativa(prompt);
            if (resposta && resposta.length > 0) {
                return resposta;
            }
        } catch (erro) {
            console.warn("[Pessoa 8] Falha ao gerar narrativa via Gemini. Usando narrativa local de fallback.", erro);
        }
    }

    // Fallback local se não houver chave ou requisição falhar
    const lista = NARRATIVAS_PADRAO[cenario] || NARRATIVAS_PADRAO["Floresta"];
    const indice = Math.floor(Math.random() * lista.length);
    return lista[indice];
}
