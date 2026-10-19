const mapaContainer = document.querySelector(".jogo-mapa-container");

const tamanhoMapa = 15;

for(let i=0; i < 10 * 15; i++){
    const celula = document.createElement("div");
    celula.classList.add("mapa-celula");
    mapaContainer.appendChild(celula);
}