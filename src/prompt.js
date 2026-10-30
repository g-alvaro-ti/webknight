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
    - Exatamente um jogador e uma saída.
    - Pelo menos um inimigo.
    - Todos os inimigos devem ser alcançáveis pelo jogador
        através de pisos caminháveis.
    - Utilize somente os valores da legenda.

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
    const MODELO = "gemini-2.5-flash";
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
        return texto || "O Gemini não retornou um texto.";

    } catch (erro) {
        console.error("Erro ao chamar a API:", erro);
        throw erro;
    }    
}

botaoGeminiMapa.addEventListener("click", async function() {
    console.log("Resultado do prompt:");
    texto = gerar_prompt_mapa(lista_regiao)
    resposta_prompt = await chamar_gemini(texto);
    console.log(resposta_prompt);

    console.log("Mapa:")
    const mapa = JSON.parse(resposta_prompt);
    console.log(mapa.matriz_mapa);
});