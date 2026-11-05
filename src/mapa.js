const mapaContainer = document.querySelector(".jogo-mapa-container");

const LINHAS = 10;
const COLUNAS = 15;

const SPRITE_PLAYER = "sprites/Soldier_Idle1.png"
const SPRITE_DEMON = "sprites/Demon_A_Idle1.png"
const OBJECT_TREE = "sprites/object-tree.png"
const TEXTURE_1 = "sprites/texture.png"
const TEXTURE_2 = "sprites/texture2.png"

const CORES_REGIOES = {
    "Floresta": {
        0: "#477A3C", // Piso
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

    // Obtém as cores correspondentes à região
    const cores = CORES_REGIOES[tipo_cenario];

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
                    adicionarCamada(celula, OBJECT_TREE, 2);
                    break;
                case 3: // Inimigo
                    celula.style.backgroundColor = cores[3];
                    celula.dataset.tipo = "piso"

                    adicionarSpriteAnimado(celula, "demon-idle", 2)
                    break;
                case 4: // Jogador
                    celula.style.backgroundColor = cores[4];
                    celula.dataset.tipo = "piso"

                    adicionarSpriteAnimado(celula, "cavaleiro-idle", 2)
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

// Adicionando spritesheets
// adicionarSpriteAnimado(mapa[0][0], "cavaleiro-idle", 2)
// adicionarSpriteAnimado(mapa[0][2], "demon-idle", 2)
// Adicionando imagens paradas
// adicionarCamada(mapa[1][0], SPRITE_PLAYER, 2);
// adicionarCamada(mapa[1][2], SPRITE_DEMON, 2);