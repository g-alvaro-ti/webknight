`
Criar o prompt para gerar uma matriz JSON numérica.
Definir os números que representam chão, parede, jogador, inimigo e saída.
Incluir instruções para posicionar as entidades em locais válidos e cercadas por chão caminhável.
Criar a função que chama o Gemini e retorna a matriz.
Implementar o parâmetro regiao, selecionado aleatoriamente de uma lista predefinida.
`

const PISO = 0;
const SAIDA = 1;
const PAREDE = 2;
const INIMIGO = 3;
const JOGADOR = 4;

const FLORESTA = "Floresta";
const CIDADE = "Cidade";
const RUINA = "Ruina";
const MONTANHA = "Montanha";

lista_constante = [PISO,SAIDA,PAREDE,INIMIGO,JOGADOR]
lista_regiao = [FLORESTA,CIDADE,RUINA,MONTANHA]

function cenario_aleatorio(lista_regiao){
    indice = Math.floor(Math.random * lista_regiao.length);
    return lista_regiao[indice];
}

function gerar_prompt_mapa(lista_constante,lista_regiao){
    const cenario = cenario_aleatorio(lista_regiao)
    const prompt = `
    Atue como um bardo narrando a jornada de um heroi gere uma descrição breve de no maximo 3 linhas
    sobre o cenário que está na variavel ${cenario} que o heroi se encontra, a quantidade de inimigos, o mapa que é representado por
    matriz 10x15 contendo: 
    -piso caminhavel
    -saida,paredes
    -inimigos 
    -jogador
    com as seguintes considerações de que o jogador é unico é todos os inimigos devem ter pelo menos um caminho
    caminhavel até eles.
    e tipo de cenario que se encontra a resposta deve sair em json puro sem markdown 
    com os seguintes campos:
    resposta {
        tipo_cenario : str,
        descricao : str,
        matriz_mapa : int[][],
        quantidade_inimigos : int
    }
    a matriz_mapa de seguir os parametros desse seguinte vetor ${lista_constante}
    `
    return prompt;
}

async function chamar_gemini(prompt) {
    //para testes lembre-se de trocar
    const API_KEY = "Chave";
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
                ]
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

//função para testes
/*async function main() {
    texto = gerar_prompt_mapa(lista_constante,lista_regiao);
    resposta = await chamar_gemini(texto);
    console.log(resposta);
}*/