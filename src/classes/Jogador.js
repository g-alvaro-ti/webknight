import { Personagem } from "./Personagem.js";

export class Jogador extends Personagem {
    // Atributo privado para segurança.
    #nivel;
    #experiencia_atual;
    #max_experiencia;

    constructor(nome, vida, forca, defesa, velocidade, nivel = 1,experiencia_atual = 0) {
        super(nome, vida, forca, defesa, velocidade);
        this.#nivel = nivel;
        this.#experiencia_atual = experiencia_atual;
        this.#experiencia_atual = 100;
    }

    get nivel() {
        return this.#nivel;
    }

    set nivel(nivel) {
        if(nivel < 1){
            this.#nivel = 1;
        } 
        else{
            this.#nivel = nivel;
            this.#experiencia_atual = 0;
            this.#max_experiencia = this.#max_experiencia*1.5;
        } 
    }

    get experiencia_atual(){
        return this.#experiencia_atual;
    }

    set experiencia(experiencia_atual){
        this.#experiencia_atual = experiencia_atual;
    }

    verifica_nivel(){
        if(this.#experiencia_atual > this.#max_experiencia){
            return true;
        }else{
            return false;
        }
    }
    /**
    *@param{string} atributo_aumentado - O nome de um dos atributos da classe Personagem.
    *@param{number} quantidade_aumentada - Valor que a função set irá receber.
    */
    //O ideal é chamar essa função após o termino de cada batalha depois de verificar se o jogador pode 
    //subir de nivel e caso puder exibir uma tela onde ele escolherá qual atributo quer aumentar
    //via interface gráfica e colocar como parametro dessa função o nome do atributo escolhido.
    //A quantidade pode ser constante ou não.
    eleva_nivel(atributo_aumentado,quantidade_aumentada) {
        this.#nivel = this.#nivel+1;
        this[atributo_aumentado] +=quantidade_aumentada;
    }
}