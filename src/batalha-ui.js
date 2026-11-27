// Funções dos botões de batalha
async function aoClicarAtacar() {
    console.log("Botão ATACAR acionado.");
    alternarBotoesBatalha(false);
    try {
        await tocarSpriteBatalhaUmaVez("jogador", "cavaleiro-ataque01");
        await tocarSpriteBatalhaUmaVez("inimigo", "demon-hurt");
    } finally {
        alternarBotoesBatalha(true);
    }
}

async function aoClicarDefender() {
    console.log("Botão DEFENDER acionado.");
    alternarBotoesBatalha(false);
    try {
        await tocarSpriteBatalhaUmaVez("inimigo", "demon-ataque01");
        await tocarSpriteBatalhaUmaVez("jogador", "cavaleiro-hurt");
    } finally {
        alternarBotoesBatalha(true);
    }
}

async function aoClicarItem() {
    console.log("Botão ITEM acionado.");
}

async function aoClicarFugir() {
    console.log("Botão FUGIR acionado.");
    alternarBotoesBatalha(false);
    try {
        exibirMensagemBatalha("Você tentou fugir, mas o inimigo cercou seu caminho.")
        await tocarSpriteBatalhaUmaVez("inimigo", "demon-ataque01");
        await tocarSpriteBatalhaUmaVez("jogador", "cavaleiro-hurt");
        await tocarSpriteBatalhaECongelar("jogador", "cavaleiro-death");
    } finally {
        alternarBotoesBatalha(false);
    }
}

/**
 * Escreve uma mensagem na caixa de texto da tela de batalha.
 * @param {string} mensagem - Texto a ser exibido na caixa de diálogo
 */
function exibirMensagemBatalha(mensagem) {
    const caixaTexto = document.querySelector("#tela-batalha .batalha-caixa-texto");
    if (!caixaTexto) return;

    let paragrafo = caixaTexto.querySelector("p");
    if (!paragrafo) {
        paragrafo = document.createElement("p");
        caixaTexto.appendChild(paragrafo);
    }

    paragrafo.textContent = mensagem ?? "";
}

/**
 * Atualiza o nome exibido de um combatente ("jogador" ou "inimigo").
 * @param {"jogador"|"inimigo"} combatente
 * @param {string} nome
 */
function atualizarNomeCombatente(combatente, nome) {
    const elementoNome = document.querySelector(`#tela-batalha .batalha-${combatente} .batalha-nome`);
    if (!elementoNome) return;

    elementoNome.textContent = nome ?? "";
}

/**
 * Atualiza a barra e o texto de HP de um combatente ("jogador" ou "inimigo").
 * @param {"jogador"|"inimigo"} combatente
 * @param {number} vidaAtual
 * @param {number} vidaMax
 */
function atualizarVidaCombatente(combatente, vidaAtual, vidaMax) {
    const container = document.querySelector(`#tela-batalha .batalha-${combatente}`);
    if (!container) return;

    const preenchimento = container.querySelector(".batalha-hp-preenchimento");
    const textoHp = container.querySelector(".batalha-hp-texto");

    const maxSeguro = Math.max(0, Number(vidaMax) || 0);
    const atualSeguro = Math.max(0, Math.min(Number(vidaAtual) || 0, maxSeguro));
    const percentual = maxSeguro > 0 ? (atualSeguro / maxSeguro) * 100 : 0;

    if (preenchimento) {
        preenchimento.style.width = `${percentual}%`;
    }

    if (textoHp) {
        textoHp.textContent = `HP ${atualSeguro} / ${maxSeguro}`;
    }
}

function atualizarNomeJogador(nome) {
    atualizarNomeCombatente("jogador", nome);
}

function atualizarNomeInimigo(nome) {
    atualizarNomeCombatente("inimigo", nome);
}

function atualizarVidaJogador(vidaAtual, vidaMax) {
    atualizarVidaCombatente("jogador", vidaAtual, vidaMax);
}

function atualizarVidaInimigo(vidaAtual, vidaMax) {
    atualizarVidaCombatente("inimigo", vidaAtual, vidaMax);
}

/**
 * Ativa ou desativa todos os botões de ação da tela de batalha.
 * @param {boolean} habilitado - `true` para reativar os botões, `false` para desativar
 */
function alternarBotoesBatalha(habilitado) {
    const botoes = document.querySelectorAll("#tela-batalha .batalha-acoes .batalha-btn");
    botoes.forEach((botao) => {
        botao.disabled = !habilitado;
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const acoesBotoes = [
        [".batalha-btn-atacar", aoClicarAtacar],
        [".batalha-btn-defender", aoClicarDefender],
        [".batalha-btn-item", aoClicarItem],
        [".batalha-btn-fugir", aoClicarFugir]
    ];

    acoesBotoes.forEach(([seletor, manipulador]) => {
        const botao = document.querySelector(`#tela-batalha ${seletor}`);
        if (botao) {
            botao.addEventListener("click", manipulador);
        }
    });

    // Exibição de exemplo na tela de batalha usando as classes de sprites.css
    exibirSpriteBatalha(".batalha-jogador .batalha-base-sprite", "cavaleiro-idle");
    exibirSpriteBatalha(".batalha-inimigo .batalha-base-sprite", "demon-idle");

    atualizarNomeInimigo("Demonho")
    atualizarNomeJogador("Jogador")

    atualizarVidaJogador(40,100)
    atualizarVidaInimigo(180,240)
});
