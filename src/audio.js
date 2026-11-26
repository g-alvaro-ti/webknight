// Gerenciador simples de músicas de fundo e efeitos sonoros do jogo

class GerenciadorAudio {
    constructor() {
        this.musicasMapa = {
            "Floresta": new Audio("assets/audio/Musica mapa floresta.mp3"),
            "Cidade":   new Audio("assets/audio/Musica mapa cidade.mp3"),
            "Montanha": new Audio("assets/audio/Musica mapa montanha.mp3"),
            "Ruina":    new Audio("assets/audio/Musica mapa ruina.mp3")
        };

        for (const musica of Object.values(this.musicasMapa)) {
            musica.loop = true;
            musica.volume = 0.4;
        }

        this.efeitos = {
            andar:   new Audio("assets/audio/Som de andar.mp3"),
            ataque:  new Audio("assets/audio/Som de ataque.mp3"),
            click:   new Audio("assets/audio/Som de click.mp3"),
            correr:  new Audio("assets/audio/Som de correr.mp3"),
            defesa:  new Audio("assets/audio/Som de defesa.mp3"),
            derrota: new Audio("assets/audio/Som de derrota.mp3"),
            inimigo: new Audio("assets/audio/Som de inimigo.mp3"),
            item:    new Audio("assets/audio/Som de item.mp3"),
            vitoria: new Audio("assets/audio/Som de vitoria.mp3")
        };

        this.musicaAtual = null;
        this.cenarioAtual = "Floresta";
    }

    tocarMusicaMapa(cenario) {
        if (cenario) this.cenarioAtual = cenario;

        const novaMusica = this.musicasMapa[this.cenarioAtual];
        if (!novaMusica) return;

        if (this.musicaAtual === novaMusica && !novaMusica.paused) return;

        this.pararMusica();
        this.musicaAtual = novaMusica;
        this.musicaAtual.currentTime = 0;
        this.musicaAtual.play().catch(() => {});
    }

    pararMusica() {
        if (this.musicaAtual) {
            this.musicaAtual.pause();
            this.musicaAtual.currentTime = 0;
        }
    }

    tocarEfeito(nome) {
        const som = this.efeitos[nome];
        if (!som) return;

        som.currentTime = 0;
        som.play().catch(() => {});
    }
}

const gerenciadorAudio = new GerenciadorAudio();

// Funções simples para uso direto em qualquer parte do jogo
function tocarMusicaMapa(cenario) { gerenciadorAudio.tocarMusicaMapa(cenario); }
function pararMusicaMapa()        { gerenciadorAudio.pararMusica(); }
function tocarSomAndar()          { gerenciadorAudio.tocarEfeito("andar"); }
function tocarSomAtaque()         { gerenciadorAudio.tocarEfeito("ataque"); }
function tocarSomClick()          { gerenciadorAudio.tocarEfeito("click"); }
function tocarSomCorrer()         { gerenciadorAudio.tocarEfeito("correr"); }
function tocarSomDefesa()         { gerenciadorAudio.tocarEfeito("defesa"); }
function tocarSomDerrota()        { gerenciadorAudio.tocarEfeito("derrota"); }
function tocarSomInimigo()        { gerenciadorAudio.tocarEfeito("inimigo"); }
function tocarSomItem()           { gerenciadorAudio.tocarEfeito("item"); }
function tocarSomVitoria()        { gerenciadorAudio.tocarEfeito("vitoria"); }

// Toca o som de click ao apertar qualquer botão da interface
document.addEventListener("click", (evento) => {
    if (evento.target.closest("button")) {
        tocarSomClick();
    }
});
