import { Personagem } from "./Personagem";

export class Jogador extends Personagem {
    // Atributo privado para segurança.
    #nivel;

    constructor(nome, vida, forca, defesa, velocidade, nivel = 1) {
        super(nome, vida, forca, defesa, velocidade);
        this.#nivel = nivel;
    }

    get nivel() {
        return this.#nivel;
    }

    set nivel(nivel) {
        if(nivel < 1) this.#nivel = 1;
        else this.#nivel = nivel;
    }

}