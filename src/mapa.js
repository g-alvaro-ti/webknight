const mapaContainer = document.querySelector(".jogo-mapa-container");

const LINHAS = 10;
const COLUNAS = 15;

const SPRITE_PLAYER = "sprites/Soldier_Idle1.png"
const SPRITE_DEMON = "sprites/Demon_A_Idle1.png"

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

// Adicionando spritesheets
adicionarSpriteAnimado(mapa[0][0], "cavaleiro-idle", 2)
adicionarSpriteAnimado(mapa[0][2], "demon-idle", 2)
// Adicionando imagens paradas
adicionarCamada(mapa[1][0], SPRITE_PLAYER, 2);
adicionarCamada(mapa[1][2], SPRITE_DEMON, 2);