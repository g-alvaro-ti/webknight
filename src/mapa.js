const mapaContainer = document.querySelector(".jogo-mapa-container");

const tamanhoMapa = 15;

// Função para injetar uma imagem em uma célula específica
function adicionarCamada(celula, caminhoImagem, ordemZ = 1) {
    const img = document.createElement("img");
    img.src = caminhoImagem;
    img.classList.add("camada-sprite");
    img.style.zIndex = ordemZ;
    celula.appendChild(img);
    return img;
}

for(let i=0; i < 10 * 15; i++){
    const celula = document.createElement("div");
    celula.classList.add("mapa-celula");
    celula.dataset.indice = i;

    if (i === 66) {
        adicionarCamada(celula, "sprites/Soldier_Idle.png", 2);
    }
    else if (i === 68) {
        adicionarCamada(celula, "sprites/Demon_A_Idle.png", 2);
    }

    mapaContainer.appendChild(celula);
}