/** Classe abstrata para representar os personagens do jogo como os inimigos e o próprio jogador. */
export class Personagem {
    // Atributos privados para segurança.
    #vida;
    #forca;
    #defesa;
    #velocidade;

    constructor(nome, vida, forca, defesa, velocidade) {
        if(this.construtor == Personagem)
            throw new Error("Não é possível instânciar uma classe Abstrata");

        this.nome = nome;
        this.#vida = vida;
        this.#forca = forca;
        this.#defesa = defesa;
        this.#velocidade = velocidade;
        
        // Cordenadas do mapa.
        this.x = 0;
        this.y = 0;
    }
    
    get nome() {
        return this.nome;
    }

    set nome(nome) {
        this.nome = nome;
    }
    
    get vida() {
        return this.#vida;
    }
    
    set vida(vida) {
        if(vida < 0) this.#vida = 0;
        else this.#vida = vida;
    }
    
    get forca() {
        return this.#forca;
    }
    
    set forca(forca) {
        if(forca < 0) this.forca = 0;
        else this.#forca = forca;
    }

    get defesa() {
        return this.#defesa;
    }
    
    set defesa(defesa) {
        if(defesa < 0) this.#defesa = 0;
        else this.#defesa = defesa;
    }
    
    get velocidade() {
        return this.#velocidade;
    }

    set velocidade(velocidade) {
        if(velocidade < 0) this.#velocidade = 0;
        else this.velocidade = velocidade;
    }

    // Método para mover o personagem pelo mapa.
    mover(dx, dy) {
        this.x += dx * this.velocidade;
        this.y += dy * this.velocidade;
    }

    /** Método abstrato para realizar ataques a um alvo especifico. Todas as subclasses que extendem essa classe
     * devem implemetar esse método.
     * 
     * @param alvo personagem a ser atacado (Jogador, Inimigo).
    */
    atacar(alvo) {
        throw new Error("O método 'atacar()' deve ser implementado pelas subclasses");
    }

}