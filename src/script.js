
function inicio(){

    exibirTelaInicial(true)

    // exibirJogo()

    // exibirBatalhaTurno()

    // exibirTelaFinal()
}

function exibirTelaInicial(estado){
    telaInicial = document.querySelector("#tela-inicial");
    telaInicial.classList.toggle("hidden", estado)
}

function exibirJogo(estado){
    jogo = document.querySelector("#jogo");
    jogo.classList.toggle("hidden", estado)
}

function exibirBatalhaTurno(estado){
    batalhaTurno = document.querySelector("#batalha-turno");
    batalhaTurno.classList.toggle("hidden", estado)
}

function exibirTelaFinal(estado){
    telaFinal = document.querySelector("#tela-final");
    telaFinal.classList.toggle("hidden", estado)
}