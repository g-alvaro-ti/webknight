import { Personagem } from "./Personagem";

/** Classe inimigo que representa os oponentes do jogador no mapa. */
export class Inimigo extends Personagem {    
    constructor(nome, vida, forca, defesa, velocidade, tipo) {
        super(nome, vida, forca, defesa, velocidade);
        this.tipo = tipo;
    }

    atacar(alvo) {}
}