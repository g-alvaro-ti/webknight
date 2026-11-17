import { Jogador } from "./Jogador.js";

// Regra do enunciado: a cada 5 transições de cenário sem derrota, o jogador encontra um chefe.
export const TRANSICOES_ATE_CHEFE = 5;

// Tamanho máximo de cada trecho de narrativa exibido na tela.
export const LIMITE_CARACTERES = 200;

// Quantos trechos anteriores vão no prompt, como "memória" da história.
const TRECHOS_NO_CONTEXTO = 3;

// Quantos trechos ficam guardados (e depois persistidos no Firebase).
const MAX_HISTORICO = 30;

// Narrativas de fallback, usadas quando a API falha (enunciado: mínimo de 5).
// "regiao" liga o texto ao tipo de cenário: em caso de falha, o jogo prefere um texto
// da mesma região do mapa que está na tela, e só usa os demais se não houver.
const NARRATIVAS_FALLBACK = [
     // --- Textos genéricos (usam o nome do jogador) ---
     {
          regiao: "Ruina",
          texto: "{nome}, você adormeceu e sonhou que enfrentava uma pessoa misteriosa. Ao despertar, a escuridão ao redor parece guardar algo que o observa."
     },
     {
          regiao: "Floresta",
          texto: "Uma névoa densa cobre o caminho, {nome}. Vozes distantes sussurram seu nome, e algo se move entre as sombras logo à frente."
     },
     {
          regiao: "Montanha",
          texto: "O vento muda de direção, {nome}, trazendo cheiro de ferro e cinzas. Quem quer que esteja à frente já sabe que você está chegando."
     },
     {
          regiao: "Ruina",
          texto: "O chão treme sob seus pés, {nome}. Seja o que for que habita este lugar, não pretende deixá-lo passar sem lutar."
     },
     {
          regiao: "Cidade",
          texto: "Um sino toca ao longe, mas não há ninguém por perto, {nome}. Cada janela escura parece esconder um par de olhos famintos."
     },
     {
          regiao: "Floresta",
          texto: "Você tropeça em uma passagem esquecida, {nome}. Do outro lado, o ar é frio e silencioso, e algo se mexe, atento à sua chegada."
     },

     // --- Textos por região (escritos por Breno) ---
     {
          regiao: "Floresta",
          texto: "Você adentra uma parte mais densa da Floresta. Entre árvores colossais e sombras sinuosas, o arrepio na nuca avisa que novos monstros espreitam na névoa."
     },
     {
          regiao: "Floresta",
          texto: "A vegetação fica mais fechada e úmida. O som de passos nas folhas secas indica que você não está sozinho nesta clareira da Floresta."
     },
     {
          regiao: "Floresta",
          texto: "A luz do sol mal penetra a copa da Floresta. O silêncio sepulcral é quebrado apenas pelo rosnado distante de predadores famintos."
     },
     {
          regiao: "Cidade",
          texto: "Você cruza os portões e alcança as ruas de pedra de uma antiga Cidade. Becos escuros e janelas quebradas escondem criaturas à sua espera."
     },
     {
          regiao: "Cidade",
          texto: "Edifícios em ruínas cercam a praça desta Cidade abandonada. O eco dos seus passos reverbera pelas vielas silenciosas e perigosas."
     },
     {
          regiao: "Cidade",
          texto: "A poeira cobre o calçamento desta Cidade esquecida. Sombras rastejam pelos cantos, prontas para emboscar qualquer invasor."
     },
     {
          regiao: "Ruina",
          texto: "Você penetra nos corredores esquecidos de uma Ruína ancestral. Pilares partidos e runas misteriosas guardam perigos e abominações."
     },
     {
          regiao: "Ruina",
          texto: "O cheiro de pedra gasta e magia antiga preenche o ar das Ruínas. Olhos reluzentes observam sua aproximação na escuridão."
     },
     {
          regiao: "Ruina",
          texto: "Antigos templos desmoronados formam um labirinto nesta Ruína sagrada. Criaturas profanas rondam cada corredor."
     },
     {
          regiao: "Montanha",
          texto: "O vento gélido ruge furioso nos desfiladeiros da Montanha. Trilhas íngremes e precipícios exigem cautela a cada novo passo."
     },
     {
          regiao: "Montanha",
          texto: "Você sobe por rochedos escarpados na Montanha cinzenta. Criaturas aladas e monstros das cavernas vigiam do alto."
     },
     {
          regiao: "Montanha",
          texto: "O ar rarefeito congela sua respiração nos picos da Montanha. O terreno acidentado esconde emboscadas mortais."
     }
];

// Fallback específico para a apresentação de um chefe.
const NARRATIVA_FALLBACK_CHEFE = {
     regiao: "Ruina",
     texto: "Um rugido faz o chão estremecer, {nome}. O guardião deste lugar finalmente se revelou, e não pretende deixá-lo passar com vida."
};

// Utilizando composição para a narrativa, pois toda narrativa tem um jogador.
export class Narrativa {
     #jogador;
     #inimigosDerrotados;
     #batalhasVencidas;
     #batalhasFugidas;
     #chefesDerrotados;
     #casasMovimentadas;
     #transicoes;
     #historico;
     #promptGeral;
     #ultimoFallback;

     constructor(jogador) {
          if (!(jogador instanceof Jogador))
               throw new Error("A narrativa precisa de um jogador válido.");

          this.#jogador = jogador;
          this.#inimigosDerrotados = 0;
          this.#batalhasVencidas = 0;
          this.#batalhasFugidas = 0;
          this.#chefesDerrotados = 0;
          this.#casasMovimentadas = 0;
          this.#transicoes = 0;
          this.#historico = [];
          this.#promptGeral = "";
          this.#ultimoFallback = null;
     }

     // CONTADORES

     registrarInimigoDerrotado() { this.#inimigosDerrotados++; }
     registrarBatalhaVencida()   { this.#batalhasVencidas++; }
     registrarBatalhaFugida()    { this.#batalhasFugidas++; }
     registrarChefeDerrotado()   { this.#chefesDerrotados++; }
     registrarCasaMovimentada()  { this.#casasMovimentadas++; }

     // Registra uma mudança de cenário. A gerarNarrativa() (prompt.js) já chama isso sozinha.
     registrarTransicao()        { this.#transicoes++; }

     get inimigosDerrotados() { return this.#inimigosDerrotados; }
     get batalhasVencidas()   { return this.#batalhasVencidas; }
     get batalhasFugidas()    { return this.#batalhasFugidas; }
     get chefesDerrotados()   { return this.#chefesDerrotados; }
     get casasMovimentadas()  { return this.#casasMovimentadas; }
     get transicoes()         { return this.#transicoes; }

     // ESTADO DA HISTÓRIA
     // Verdadeiro enquanto nenhum trecho da narrativa foi gerado (primeiro cenário).
     get ehInicio() {
          return this.#historico.length === 0;
     }

     // O próximo cenário é um chefe? (a cada TRANSICOES_ATE_CHEFE transições concluídas)
     get proximoCenarioEhChefe() {
          return this.#transicoes > 0 && this.#transicoes % TRANSICOES_ATE_CHEFE === 0;
     }

     // Cópia do histórico, para que ninguém altere a lista interna por fora.
     get historico() {
          return [...this.#historico];
     }

     // Guarda um trecho de narrativa já exibido ao jogador.
     registrarTrecho(texto) {
          this.#historico.push(texto);
          if (this.#historico.length > MAX_HISTORICO) this.#historico.shift();
     }

     // PROMPTS
     // Mantido por compatibilidade: prompt da primeira fase (região padrão: Floresta).
     get promptInicial() {
          return this.gerarPromptInicial();
     }

     // Último prompt de continuação/chefe gerado.
     get promptGeral() {
          return this.#promptGeral;
     }

     // Prompt do primeiro cenário. Não há histórico ainda.
     gerarPromptInicial(tipoCenario = "Floresta", descricaoMapa = "") {
          const nome = this.#jogador.nome;
          const linhas = [
               `Você é um narrador de um jogo de RPG. O jogador ${nome} está iniciando sua jornada em um cenário de ${tipoCenario}, cheio de monstros e perigos.`
          ];
          if (descricaoMapa) linhas.push(`Descrição do mapa: ${descricaoMapa}`);
          linhas.push(
               "",
               "Com base nisso, gere um texto para o jogador sobre o início de sua jornada, em tom fantasioso.",
               "",
               this.#blocoRegras()
          );
          return linhas.join("\n");
     }

     // Prompt para os cenários seguintes: usa o histórico e o estilo de jogo do jogador.
     gerarPromptContinuacao({ tipoCenario = "Floresta", descricaoMapa = "" } = {}) {
          const nome = this.#jogador.nome;
          this.#promptGeral = [
               `Você é o narrador de um jogo de RPG de fantasia. Continue a história do jogador ${nome}, que acaba de chegar a um novo cenário.`,
               "",
               this.#blocoContexto(tipoCenario, descricaoMapa),
               "",
               "Escreva o próximo trecho da narrativa, ligando o que o jogador viveu até aqui à chegada neste novo cenário.",
               "Reflita o estilo de jogo dele na história (por exemplo, se costuma fugir, comente isso), sem citar números.",
               "",
               this.#blocoRegras()
          ].join("\n");
          return this.#promptGeral;
     }

     // Prompt de apresentação de chefe: mais tenso, mas coerente com o que já aconteceu.
     gerarPromptChefe({ tipoCenario = "Floresta", descricaoMapa = "" } = {}) {
          const nome = this.#jogador.nome;
          this.#promptGeral = [
               `Você é o narrador de um jogo de RPG de fantasia. O jogador ${nome} está prestes a enfrentar um CHEFE, um inimigo muito mais poderoso que os anteriores.`,
               "",
               this.#blocoContexto(tipoCenario, descricaoMapa),
               "",
               "Apresente o chefe de forma ameaçadora, em um tom de clímax, e de modo coerente com a história até aqui.",
               "Não contradiga o histórico e não cite números.",
               "",
               this.#blocoRegras()
          ].join("\n");
          return this.#promptGeral;
     }

     // Resume como o jogador vem jogando, para a IA refletir isso na história.
     #descreverPerfil() {
          const vencidas = this.#batalhasVencidas;
          const fugidas = this.#batalhasFugidas;

          if (vencidas + fugidas === 0) return "ainda não enfrentou nenhuma batalha";
          if (fugidas > vencidas) return "covarde, costuma fugir das ameaças";
          if (vencidas > fugidas) return "corajoso, costuma enfrentar as ameaças";
          return "cauteloso, ora luta, ora foge";
     }

     // Histórico recente + estado do jogador + novo cenário.
     #blocoContexto(tipoCenario, descricaoMapa) {
          const recentes = this.#historico.slice(-TRECHOS_NO_CONTEXTO);
          const historico = recentes.length
               ? recentes.map((trecho, i) => `${i + 1}. ${trecho}`).join("\n")
               : "Nenhum ainda.";

          return [
               "HISTÓRICO RECENTE DA HISTÓRIA (do mais antigo ao mais recente):",
               historico,
               "",
               `ESTADO DO JOGADOR ${this.#jogador.nome}:`,
               `- Estilo de jogo: ${this.#descreverPerfil()}`,
               `- Inimigos derrotados: ${this.#inimigosDerrotados}`,
               `- Batalhas vencidas: ${this.#batalhasVencidas}`,
               `- Batalhas em que fugiu: ${this.#batalhasFugidas}`,
               `- Chefes derrotados: ${this.#chefesDerrotados}`,
               `- Cenários já percorridos: ${this.#transicoes}`,
               `- Casas percorridas: ${this.#casasMovimentadas}`,
               "",
               "NOVO CENÁRIO:",
               `- Região: ${tipoCenario}`,
               `- Descrição do mapa: ${descricaoMapa || "não informada"}`
          ].join("\n");
     }

     #blocoRegras() {
          return [
               "REGRAS:",
               `- Dirija-se ao jogador pelo nome: ${this.#jogador.nome}`,
               "- Use sempre texto simples: sem itálico, sublinhado, negrito, listas ou emojis.",
               `- O texto pode ter no máximo ${LIMITE_CARACTERES} caracteres.`,
               "- Não repita frases do histórico.",
               "- Retorne somente o texto da narrativa, sem aspas e sem título."
          ].join("\n");
     }

     // TRATAMENTO DA RESPOSTA E FALLBACK

     // Remove marcações Markdown que a IA colocar por conta própria e respeita o limite de caracteres.
     limparTexto(texto) {
          const limpo = String(texto ?? "")
               .replace(/[*_#`~]/g, "")
               .replace(/\s+/g, " ")
               .trim()
               .replace(/^["“”]+|["“”]+$/g, "");

          if (limpo.length <= LIMITE_CARACTERES) return limpo;

          // Passou do limite: corta no fim da última frase completa; se não der, corta numa palavra.
          const corte = limpo.slice(0, LIMITE_CARACTERES);
          const fimFrase = Math.max(corte.lastIndexOf("."), corte.lastIndexOf("!"), corte.lastIndexOf("?"));
          if (fimFrase >= LIMITE_CARACTERES / 2) return corte.slice(0, fimFrase + 1);
          return corte.slice(0, corte.lastIndexOf(" ")) + "…";
     }

     // Narrativa de fallback para quando a API falha.
     // Prefere um texto da mesma região do mapa atual e evita repetir o último usado.
     // Retorna { texto, regiao }, onde "regiao" sugere o cenário de fallback correspondente.
     obterFallback(ehChefe = false, regiao = null) {
          let item;

          if (ehChefe) {
               item = NARRATIVA_FALLBACK_CHEFE;
          } else {
               const daRegiao = NARRATIVAS_FALLBACK.filter(n => n.regiao === regiao);
               const lista = daRegiao.length ? daRegiao : NARRATIVAS_FALLBACK;

               const opcoes = lista.filter(n => n !== this.#ultimoFallback);
               const sorteio = opcoes.length ? opcoes : lista;

               item = sorteio[Math.floor(Math.random() * sorteio.length)];
               this.#ultimoFallback = item;
          }

          return {
               regiao: item.regiao,
               texto: item.texto.replaceAll("{nome}", this.#jogador.nome)
          };
     }

     // ------------------------------------------------------------
     // PERSISTÊNCIA (Firebase): objeto simples, sem campos privados nem undefined
     // ------------------------------------------------------------

     exportar() {
          return {
               inimigosDerrotados: this.#inimigosDerrotados,
               batalhasVencidas: this.#batalhasVencidas,
               batalhasFugidas: this.#batalhasFugidas,
               chefesDerrotados: this.#chefesDerrotados,
               casasMovimentadas: this.#casasMovimentadas,
               transicoes: this.#transicoes,
               historico: [...this.#historico]
          };
     }

     // Restaura o estado salvo. Uso: const n = new Narrativa(jogador); n.restaurar(dadosDoFirebase);
     restaurar(dados = {}) {
          this.#inimigosDerrotados = dados.inimigosDerrotados ?? 0;
          this.#batalhasVencidas = dados.batalhasVencidas ?? 0;
          this.#batalhasFugidas = dados.batalhasFugidas ?? 0;
          this.#chefesDerrotados = dados.chefesDerrotados ?? 0;
          this.#casasMovimentadas = dados.casasMovimentadas ?? 0;
          this.#transicoes = dados.transicoes ?? 0;
          this.#historico = Array.isArray(dados.historico)
               ? dados.historico.slice(-MAX_HISTORICO)
               : [];
     }
}