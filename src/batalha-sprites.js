function obterBaseSpriteBatalha(base) {
    if (base === "jogador" || base === "inimigo") {
        return document.querySelector(`#tela-batalha .batalha-${base} .batalha-base-sprite`);
    }

    return typeof base === "string" ? document.querySelector(base) : base;
}

/**
 * Renderiza uma spritesheet animada (definida em sprites.css) dentro de uma base da batalha.
 * @param {HTMLElement|string} base - Elemento da base, seletor CSS ou "jogador" / "inimigo"
 * @param {string} classeSprite - Classe da spritesheet definida em sprites.css (ex: "cavaleiro-idle", "demon-idle")
 * @returns {HTMLDivElement|null} Elemento do sprite inserido na base
 */
function exibirSpriteBatalha(base, classeSprite) {
    const containerBase = obterBaseSpriteBatalha(base);
    if (!containerBase || !classeSprite) return null;

    const spriteAtual = containerBase.querySelector(".sprite-animado");
    if (spriteAtual && spriteAtual._cancelarAnimacao) {
        spriteAtual._cancelarAnimacao();
    }

    containerBase.replaceChildren();

    const sprite = document.createElement("div");
    sprite.classList.add("sprite-animado", "batalha-sprite", classeSprite);
    sprite.dataset.spriteBase = classeSprite;

    containerBase.appendChild(sprite);
    return sprite;
}

/**
 * Toca todos os frames de uma spritesheet uma única vez e volta para a spritesheet anterior.
 * @param {HTMLElement|string} base - Elemento da base, seletor CSS ou "jogador" / "inimigo"
 * @param {string} classeSprite - Classe da spritesheet temporária (ex: "cavaleiro-ataque01")
 * @returns {Promise<boolean>} Resolve com `true` ao concluir normalmente, ou `false` se interrompida
 */
function tocarSpriteBatalhaUmaVez(base, classeSprite) {
    const containerBase = obterBaseSpriteBatalha(base);
    if (!containerBase || !classeSprite) return Promise.resolve(false);

    const sprite = containerBase.querySelector(".sprite-animado");
    if (!sprite) return Promise.resolve(false);

    // Se já havia uma animação única rodando, cancela antes de iniciar a nova
    if (sprite._cancelarAnimacao) {
        sprite._cancelarAnimacao();
    }

    // Guarda a spritesheet que estava anteriormente, pra poder voltar nela quando a animação acabar
    const classeAnterior = sprite.dataset.spriteBase;
    if (classeAnterior) sprite.classList.remove(classeAnterior);

    sprite.classList.add(classeSprite, "sprite-uma-vez");

    // Reinicia a animação CSS do frame 0 mesmo se a mesma classe for usada novamente
    sprite.style.animation = "none";
    void sprite.offsetWidth;
    sprite.style.animation = "";

    const duracaoSegundos = parseFloat(getComputedStyle(sprite).animationDuration) || 0.8;
    const duracaoMs = duracaoSegundos * 1000;

    return new Promise((resolve) => {
        let finalizada = false;

        const finalizar = (concluida) => {
            if (finalizada) return;
            finalizada = true;

            sprite.removeEventListener("animationend", aoTerminar);
            clearTimeout(timerFallback);
            delete sprite._cancelarAnimacao;

            // Volta pra spritesheet que estava anteriormente
            sprite.classList.remove("sprite-uma-vez", classeSprite);
            if (classeAnterior) sprite.classList.add(classeAnterior);

            resolve(concluida);
        };

        const aoTerminar = (evento) => {
            if (evento.animationName === "animar-sprite-uma-vez") {
                finalizar(true);
            }
        };

        sprite._cancelarAnimacao = () => finalizar(false);
        // Chama a função de terminar automaticamente quando a animação do CSS finalizar
        sprite.addEventListener("animationend", aoTerminar);

        // Se a aba estiver oculta, o animationend do CSS pode não disparar
        // Usa a duração pra garantir que a função de finalizar vai ser chamada
        const timerFallback = setTimeout(() => finalizar(true), duracaoMs + 150);
    });
}
