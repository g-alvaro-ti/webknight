/**
 * Renderiza uma spritesheet animada (definida em sprites.css) dentro de uma base da batalha.
 * @param {HTMLElement|string} base - Elemento da base ou seletor CSS (ex: ".batalha-jogador .batalha-base-sprite")
 * @param {string} classeSprite - Classe da spritesheet definida em sprites.css (ex: "cavaleiro-idle", "demon-idle")
 * @returns {HTMLDivElement|null} Elemento do sprite inserido na base
 */
function exibirSpriteBatalha(base, classeSprite) {
    const containerBase = typeof base === "string"
        ? document.querySelector(base)
        : base;

    if (!containerBase || !classeSprite) return null;

    containerBase.replaceChildren();

    const sprite = document.createElement("div");
    sprite.classList.add(
        "sprite-animado",
        "batalha-sprite",
        classeSprite
    );

    containerBase.appendChild(sprite);
    return sprite;
}

// Exibição de exemplo na tela de batalha usando as classes de sprites.css
document.addEventListener("DOMContentLoaded", () => {
    exibirSpriteBatalha(".batalha-jogador .batalha-base-sprite", "cavaleiro-idle");
    exibirSpriteBatalha(".batalha-inimigo .batalha-base-sprite", "demon-idle");
});
