/**
 * Exibe o modal de evolução de atributos (Level Up) com os valores atuais.
 * @param {object} [atributos] - Valores atuais dos atributos exibidos no modal
 * @param {number} [atributos.vida=100] - Vida atual/máxima exibida
 * @param {number} [atributos.forca=18] - Força atual exibida
 * @param {number} [atributos.defesa=8] - Defesa atual exibida
 * @param {number} [atributos.velocidade=20] - Velocidade atual exibida
 */
let Player;
const VALOR_EVOLUCAO = 5;
export function exibirModalEvolucao(jogador) {
    const modal = document.getElementById("modal-evolucao");
    if (!modal) return;
    Player = jogador;
    const valores = {"vida" : jogador.vida,"forca" : jogador.forca,
        "defesa": jogador.defesa,"velocidade" : jogador.velocidade};
    Object.entries(valores).forEach(([atributo, valor]) => {
        const elementoValor = document.getElementById(`evolucao-valor-${atributo}`);
        if (elementoValor) {
            elementoValor.textContent = String(valor);
        }
    });

    modal.hidden = false;
}

/**
 * Fecha o modal de evolução de atributos.
 */
function fecharModalEvolucao() {
    const modal = document.getElementById("modal-evolucao");
    if (modal) {
        modal.hidden = true;
    }
}

// Funções dos botões "+" (a lógica real de evolução será implementada posteriormente)
function aoClicarEvoluirVida() {
    Player.eleva_nivel("vida",VALOR_EVOLUCAO);
    fecharModalEvolucao();
}

function aoClicarEvoluirForca() {
    Player.eleva_nivel("forca",VALOR_EVOLUCAO);
    fecharModalEvolucao();
}

function aoClicarEvoluirDefesa() {
    Player.eleva_nivel("defesa",VALOR_EVOLUCAO);
    fecharModalEvolucao();
}

function aoClicarEvoluirVelocidade() {
    Player.eleva_nivel("velocidade",VALOR_EVOLUCAO);
    fecharModalEvolucao();
}

document.addEventListener("DOMContentLoaded", () => {
    const acoesEvolucao = [
        ["#btn-evoluir-vida", aoClicarEvoluirVida],
        ["#btn-evoluir-forca", aoClicarEvoluirForca],
        ["#btn-evoluir-defesa", aoClicarEvoluirDefesa],
        ["#btn-evoluir-velocidade", aoClicarEvoluirVelocidade]
    ];

    acoesEvolucao.forEach(([seletor, manipulador]) => {
        const botao = document.querySelector(seletor);
        if (botao) {
            botao.addEventListener("click", manipulador);
        }
    });
});
