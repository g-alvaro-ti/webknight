`
Criar o prompt para gerar uma matriz JSON numérica.
Definir os números que representam chão, parede, jogador, inimigo e saída.
Incluir instruções para posicionar as entidades em locais válidos e cercadas por chão caminhável.
Criar a função que chama o Gemini e retorna a matriz.
Implementar o parâmetro regiao, selecionado aleatoriamente de uma lista predefinida.
`
/*matriz_teste =  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 2, 2, 2, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0],
                [0, 0, 2, 0, 2, 0, 0, 0, 0, 2, 0, 2, 0, 3, 0],
                [0, 0, 2, 0, 2, 0, 0, 0, 0, 2, 0, 2, 0, 0, 0],
                [0, 0, 2, 0, 2, 0, 0, 4, 0, 2, 0, 2, 0, 0, 0],
                [0, 0, 2, 2, 2, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0],
                [0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

const json_teste = {"tipo_cenario" : "cidade","inimigos_derrotados" : 2,"total_inimigos": 4,"matriz_mapa" : matriz_teste}*/

const PISO = 0;
const SAIDA = 1;
const PAREDE = 2;
const INIMIGO = 3;
const JOGADOR = 4;

const FLORESTA = "Floresta";
const CIDADE = "Cidade";
const RUINA = "Ruina";
const MONTANHA = "Montanha";

const lista_constante = [PISO,SAIDA,PAREDE,INIMIGO,JOGADOR];
const lista_regiao = [FLORESTA,CIDADE,RUINA,MONTANHA];

function cenario_aleatorio(lista_regiao){
    const indice = Math.floor(Math.random() * lista_regiao.length);
    return lista_regiao[indice];
}

function gerar_prompt_saida(json_ia){
    const prompt = `
        Atue como um bardo narrando a jornada de um heroi gere uma descrição breve de no maximo 3 linhas
        narrando os acontecimentos com base no seguinte json ${JSON.stringify(json_ia)} analisando o tipo do cenario e quantos
        inimigos foram derrotados por exemplo:
        - Pelas sombras corre o guerreiro, perseguido por lâminas e rancor; Que os bardos cantem sua fuga, enquanto busca um amanhã sem dor!
        um exemplo de saida se os inimigos derrotados for igual a zero
        - “Ergueu sua espada contra as trevas, sem temor ou hesitação; E tombaram todos os inimigos diante de sua determinação!”
        um exemplo de saida se os inimigos derrotados for igual ao total de inimigos
        - “Com espada em punho, lutou bravamente, fazendo tremer cada inimigo em seu caminho! Mas 
        alguns escaparam às sombras, fugindo da lâmina e do aço; Ainda assim, cantem os bardos: pois 
        coragem não se mede por quantos tombam, mas por quantos enfrentamos!”
        -exemplo de saida com o heroi tendo derrotando alguns inimigos

        a resposta deve ser em json com os campos
        resposta {
            descricao : str
        }
        o campo descricao deve ter uma descrição que esteja de acordo com os exemplos acima onde será seu papel como trovador
        analisar qual se encaixa melhor baseado nas informações enviadas no json acima
    `;
    return prompt;
}

function gerar_prompt_mapa(lista_constante,lista_regiao){
    const cenario = cenario_aleatorio(lista_regiao)
    const prompt = `
    Atue como um bardo narrando a jornada de um heroi gere uma descrição breve de no maximo 3 linhas
    sobre esse terreno ${cenario} que o heroi se encontra, a quantidade de inimigos, o mapa que é representado por
    matriz 10x15 contendo: 
    -piso caminhavel
    -saida,paredes
    -inimigos 
    -jogador
    com as seguintes considerações de que o jogador é unico é todos os inimigos devem ter pelo menos um caminho
    caminhavel até eles.
    e tipo de cenario que se encontra o cenario a resposta deve sair em json puro sem markdown 
    com os seguintes campos:
    resposta {
        tipo_cenario : ${cenario},
        descricao : str,
        matriz_mapa : int[][],
        quantidade_inimigos : int
    }
    A matriz_mapa de seguir os parametros desse seguinte vetor ${lista_constante}
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
    texto = gerar_prompt_saida(json_teste)
    resposta = await chamar_gemini(texto);
    console.log(resposta);
}*/
    