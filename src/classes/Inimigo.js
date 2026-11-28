import { Personagem } from "./Personagem.js";

/** Classe inimigo que representa os oponentes do jogador no mapa. */
export class Inimigo extends Personagem {    

    #experiencia_dropada;

    constructor(nome, vida, forca, defesa, velocidade, tipo,experiencia_dropada) {
        super(nome, vida, forca, defesa, velocidade);
        this.tipo = tipo;
        this.#experiencia_dropada = experiencia_dropada;
    }

    get experiencia_dropada(){
        return this.#experiencia_dropada;
    }

    atacar(alvo) {}
}