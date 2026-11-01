import { Jogador } from "./Jogador";

// Utilizando composição para a narrativa, pois toda narrativa tem um jogador.
export class Narrativa{
     #jogador
     #inimigosDerrotados
     #promptInicial
     #promptGeral
     #batalhasVencidas
     #batalhasFugidas
     #chefesDerrotados
     #casasMovimentadas

     constructor(jogador){
          if(!(jogador instanceof Jogador))
               throw new Error("A narrativa precisa de um jogador válido.");
          this.#jogador = jogador
          this.#inimigosDerrotados = 0;
          this.#promptInicial = `
               Você é um narrador de um jogo de RPG, o jogador ${jogador.nome} está iniciando sua jornada em uma floresta cheia de monstros e perigos.
               
               Com base nisso gere um texto para o jogador sobre o inicio de sua jornada, use um tom fantasioso.

               REGRAS:
               Você deverá se dirigir ao jogador pelo seu nome: ${jogador.nome}
               Use sempre texto simples, ou seja: sem caracteres ítalicos, sublinhados, em negrito, etc. 
               Seu texto pode ter no máximo 200 caracteres.
               `;
          this.#promptGeral = "";
          this.#batalhasVencidas = 0;
          this.#batalhasFugidas = 0;
          this.#chefesDerrotados = 0;
          this.#casasMovimentadas = 0;
     }

     // Incrementa o número de inimigos derrotados
     set inimigosDerrotados(){
          this.#inimigosDerrotados++;
     }

     // Obtem o prompt inicial
     get promptInicial(){
          return this.#promptInicial;
     }

     // Define o prompt geral de todas as fases. OBS: Menos da primeira, o prompt inicial será utilizado nela.
     set promptGeral(promptGeral){
          this.#promptGeral = promptGeral;
     }

     // Obtem o prompt geral
     get promptGeral(){
          return this.#promptGeral;
     }

     // Incrementa o número de batalhas vencidas.
     set batalhasVencidas(){
          this.#batalhasVencidas++;
     }

     // Obtem o número de batalhas vencidas.
     get batalhasVencidas(){
          return this.#batalhasVencidas;
     }

     // Incrementa o número de batalhas em que o jogador fugiu.
     set batalhasFugidas(){
          this.#batalhasFugidas++;
     }

     // Obtem o número de batalhas fugidas.
     get batalhasFugidas(){
          return this.#batalhasFugidas;
     }

     // Incrementa o número de chefes derrotados.
     set chefesDerrotados(){
          this.#chefesDerrotados++;
     }

     // Obtem o número de chefes derrotados.
     get chefesDerrotados(){
          return this.#chefesDerrotados;
     }

     // Incrementa o número de casas movimentadas.
     set casasMovimentadas(){
          this.#casasMovimentadas++;
     }

     // Obtem o número de casas movimentadas.
     get casasMovimentadas(){
          return this.#casasMovimentadas;
     }

}