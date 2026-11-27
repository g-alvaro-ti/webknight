
function inicio(){
    
}

let modalJogar = null;

function exibirTelaInicial(estado){
    telaInicial = document.querySelector("#tela-inicial");
    telaInicial.hidden = estado
}

function exibirJogo(estado){
    jogo = document.querySelector("#tela-jogo");
    jogo.hidden = estado
}

function exibirBatalhaTurno(estado){
    batalhaTurno = document.querySelector("#tela-batalha");
    batalhaTurno.hidden = estado
}

function exibirTelaFinal(estado){
    telaFinal = document.querySelector("#tela-fim");
    telaFinal.hidden = estado
}

// Fecha o modal de jogar e faz a troca da tela inicial pra tela do jogo
function entrarNoJogo(){
    const modalJogar = document.querySelector("#modal-jogar");
    if (modalJogar) modalJogar.hidden = true;

    // Esconde a tela inicial
    exibirTelaInicial(true);

    // Mostra a tela do jogo
    exibirJogo(false);

    // Inicia a música de fundo do cenário atual
    if (typeof tocarMusicaMapa === "function") tocarMusicaMapa();

    // Garante que a tela do jogo comece visível do topo
    window.scrollTo(0, 0);
}

// Inicialização das telas
document.addEventListener("DOMContentLoaded", () => {

    exibirJogo(true);
    exibirBatalhaTurno(true);
    exibirTelaFinal(true);

    // Garante que a página abra sempre na tela inicial, sem rolagem residual
    window.scrollTo(0, 0);

    // Evento do botão iniciar
    modalJogar = document.querySelector("#modal-jogar");
    const botaoIniciar = document.querySelector("#btn-iniciar");

    if (botaoIniciar) {
        botaoIniciar.addEventListener("click", () => {
            const erroSemChave = document.querySelector("#erro-sem-chave");
            if (erroSemChave) erroSemChave.hidden = true;

            // Mostra o modal com as opções antes de entrar no jogo
            modalJogar.hidden = false;

        });
    }
    // login logout

    const btnLogin = document.querySelector("#btn-login");
    const btnLogout = document.querySelector("#btn-logout");

    const modalLogin = document.querySelector("#modal-login");
    const modalLogout = document.querySelector("#modal-logout");

    const formLogin = document.querySelector("#form-login");

    const btnCancelarLogout = document.querySelector("#btn-cancelar-logout");
    const btnConfirmarLogout = document.querySelector("#btn-confirmar-logout");

    // Abre o modal de login
    btnLogin.addEventListener("click", () => {
        modalLogin.hidden = false;
    });

    // Abre o modal de logout
    btnLogout.addEventListener("click", () => {
        modalLogout.hidden = false;
    });

    // Fecha os modais pelos botões X
    document.querySelectorAll("[data-fechar]").forEach(botao => {

        botao.addEventListener("click", () => {
            const modal = document.getElementById(
                botao.dataset.fechar
            );

            modal.hidden = true;
        });

    });

    // Fecha o modal de logout ao cancelar
    btnCancelarLogout.addEventListener("click", () => {
        modalLogout.hidden = true;
    });

    // Confirmação logout
    // A lógica de deslogar ainda será implementada
    btnConfirmarLogout.addEventListener("click", () => {
        modalLogout.hidden = true;
    });

    // Fecha o modal ao clicar fora do conteúdo
    document.querySelectorAll(".modal-overlay").forEach(modal => {

        modal.addEventListener("click", (evento) => {

            if (evento.target === modal) {
                modal.hidden = true;
            }

        });

    });

    // Fecha os modais pressionando ESC
    document.addEventListener("keydown", (evento) => {

        if (evento.key === "Escape") {
            document.querySelectorAll(".modal-overlay").forEach(modal => {
                modal.hidden = true;
            });
        }

    });

    // Impede o recarregamento da página ao enviar o formulário
    formLogin.addEventListener("submit", (evento) => {
        evento.preventDefault();

        // A lógica de autenticação será implementada posteriormente
    });


});
