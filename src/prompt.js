function gerar_prompt_mapa(){
    prompt = `
    Atue como um bardo narrando a jornada de um heroi gere uma descrição breve de no maximo 3 linhas
    sobre o cenário que o heroi se encontra, a quantidade de inimigos e sua posição em uma matriz 10x15 e o 
    tipo de cenario que se encontra a resposta deve sair em json puro sem markdown 
    com os seguintes campos:
    resposta{
        tipo_cenario : str,
        descricao : str,
        posicao_inimigos : int[][],
        quantidade_inimigos : int
    }
    `
    return prompt;
}

async function chamar_gemini(prompt) {
    //para testes lembre-se de trocar
    const API_KEY = "API_KEY";
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
