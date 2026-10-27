const mapaContainer = document.querySelector(".jogo-mapa-container");

const tamanhoMapa = 15;

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

for(let i=0; i < 10 * 15; i++){
    const celula = document.createElement("div");
    celula.classList.add("mapa-celula");
    celula.dataset.indice = i;

    if (i === 66) {
        // adicionarCamada(celula, SPRITE_PLAYER, 2);
        adicionarSpriteAnimado(celula, "cavaleiro-idle", 2);
    }
    else if (i === 68) {
        // adicionarCamada(celula, SPRITE_DEMON, 2);
        adicionarSpriteAnimado(celula, "demon-idle", 2);
    }

    mapaContainer.appendChild(celula);
}