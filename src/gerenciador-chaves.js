/*
 * CONFIGURAÇÕES: chaves da API do Gemini
 * Guarda as chaves no localStorage e faz o rodízio entre elas:
 * a cada chamada ao Gemini, usa a próxima chave da lista.
 */


const CHAVES_GEMINI_STORAGE = "webknight:chaves-gemini";

// Chaves cadastradas e índice da próxima que o rodízio vai usar
let chavesGemini = [];
let indiceChaveEmUso = 0;

function carregarChavesGemini() {
    try {
        const chavesSalvas = JSON.parse(localStorage.getItem(CHAVES_GEMINI_STORAGE));
        chavesGemini = Array.isArray(chavesSalvas) ? chavesSalvas : [];
    } catch {
        chavesGemini = [];
    }

    if (indiceChaveEmUso >= chavesGemini.length) indiceChaveEmUso = 0;
}

function salvarChavesGemini() {
    localStorage.setItem(CHAVES_GEMINI_STORAGE, JSON.stringify(chavesGemini));
    renderizarListaChaves();
}

function obterChavesGemini() {
    return chavesGemini.slice();
}

function adicionarChaveGemini(chave) {
    const chaveLimpa = chave.trim();

    if (!chaveLimpa) return false;
    if (chavesGemini.includes(chaveLimpa)) return false;

    chavesGemini.push(chaveLimpa);
    salvarChavesGemini();
    return true;
}

function removerChaveGemini(indice) {
    if (indice < 0 || indice >= chavesGemini.length) return;

    chavesGemini.splice(indice, 1);
    if (indiceChaveEmUso >= chavesGemini.length) indiceChaveEmUso = 0;

    salvarChavesGemini();
}

// Rodízio: devolve a próxima chave da lista e avança (volta ao início no fim).
// Sem chaves cadastradas, devolve uma string vazia.
function proximaChaveGemini() {
    if (chavesGemini.length === 0) return "";

    const chave = chavesGemini[indiceChaveEmUso % chavesGemini.length];
    indiceChaveEmUso = (indiceChaveEmUso + 1) % chavesGemini.length;
    return chave;
}

function mascararChaveGemini(chave) {
    return chave.length <= 10 ? chave : `${chave.slice(0, 6)}...${chave.slice(-4)}`;
}

// Mostra a lista de chaves do modal de configurações,
// marcando com "EM USO" a próxima chave do rodízio.
function renderizarListaChaves() {
    const lista = document.querySelector("#lista-chaves-gemini");
    if (!lista) return;

    lista.innerHTML = "";

    if (chavesGemini.length === 0) {
        const itemVazio = document.createElement("li");
        itemVazio.classList.add("item-chave-vazia");
        itemVazio.textContent = "Nenhuma chave cadastrada ainda.";
        lista.appendChild(itemVazio);
        return;
    }

    chavesGemini.forEach((chave, indice) => {
        const item = document.createElement("li");
        item.classList.add("item-chave-gemini");

        const textoChave = document.createElement("span");
        textoChave.classList.add("chave-mascarada");
        textoChave.textContent = mascararChaveGemini(chave);
        item.appendChild(textoChave);

        if (indice === indiceChaveEmUso % chavesGemini.length) {
            const badgeEmUso = document.createElement("span");
            badgeEmUso.classList.add("badge-chave-em-uso");
            badgeEmUso.textContent = "EM USO";
            item.appendChild(badgeEmUso);
        }

        const botaoRemover = document.createElement("button");
        botaoRemover.classList.add("btn-remover-chave");
        botaoRemover.textContent = "X";
        botaoRemover.addEventListener("click", () => {
            removerChaveGemini(indice);
        });
        item.appendChild(botaoRemover);

        lista.appendChild(item);
    });
}

function abrirModalConfiguracoes() {
    const modal = document.querySelector("#modal-configuracoes");
    if (modal) modal.hidden = false;
}

carregarChavesGemini();
renderizarListaChaves();

// Liga a tela de configurações aos eventos do modal
const botaoConfiguracoes = document.querySelector("#btn-configuracoes");
const campoChaveGemini = document.querySelector("#campo-chave-gemini");
const botaoAdicionarChave = document.querySelector("#btn-adicionar-chave");

botaoConfiguracoes.addEventListener("click", () => {
    renderizarListaChaves();
    abrirModalConfiguracoes();
});

botaoAdicionarChave.addEventListener("click", () => {
    adicionarChaveGemini(campoChaveGemini.value);
    campoChaveGemini.value = "";
});
