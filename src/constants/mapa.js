// Dimensões e regras do tabuleiro
const CONFIG_MAPA = Object.freeze({
    LINHAS: 10,
    COLUNAS: 15,
    CHANCE_INIMIGO_PARADO: 0.3, // Chance do inimigo permanecer parado em vez de tentar se movimentar
    MAX_FILA_INPUTS: 3,
    EXPIRACAO_INPUT_MS: 300, // ms
    DELAY_MOVIMENTO_MS: 150
});

// Caminhos de sprites e texturas estáticas
const ASSETS_MAPA = Object.freeze({
    SPRITE_PLAYER: "assets/sprites/Soldier_Idle1.png",
    SPRITE_DEMON:  "assets/sprites/Demon_A_Idle1.png",
    OBJECT_TREE:   "assets/sprites/object-tree.png",
    TEXTURE_1:     "assets/sprites/texture.png",
    TEXTURE_2:     "assets/sprites/texture2.png"
});

// Paleta de cores de cada bioma/região
const CORES_REGIOES = Object.freeze({
    Floresta: Object.freeze({
        0: "#558c3b", // Piso
        1: "#D9C65B", // Saída
        2: "#344D2D", // Parede
        3: "#477A3C", // Inimigo (piso)
        4: "#477A3C"  // Jogador (piso)
    }),
    Cidade: Object.freeze({
        0: "#858585",
        1: "#D9C65B",
        2: "#454545",
        3: "#858585",
        4: "#858585"
    }),
    Ruina: Object.freeze({
        0: "#81765D",
        1: "#D9C65B",
        2: "#49443A",
        3: "#81765D",
        4: "#81765D"
    }),
    Montanha: Object.freeze({
        0: "#A6ADB5",
        1: "#D9C65B",
        2: "#59616B",
        3: "#A6ADB5",
        4: "#A6ADB5"
    })
});

// Mapeamento de classe CSS do sprite por região
const INIMIGOS_REGIOES = Object.freeze({
    Floresta: "orc-idle",
    Cidade:   "orc-idle",
    Ruina:    "monster-idle",
    Montanha: "demon-idle"
});

// Direções possíveis que um inimigo pode tomar (sem diagonais)
const DIRECOES_INIMIGO = Object.freeze([
    Object.freeze({ dx:  0, dy: -1 }), // Cima
    Object.freeze({ dx:  0, dy:  1 }), // Baixo
    Object.freeze({ dx: -1, dy:  0 }), // Esquerda
    Object.freeze({ dx:  1, dy:  0 })  // Direita
]);

const TECLAS_MOVIMENTO = Object.freeze({
    w:          Object.freeze({ dx:  0, dy: -1 }),
    s:          Object.freeze({ dx:  0, dy:  1 }),
    a:          Object.freeze({ dx: -1, dy:  0 }),
    d:          Object.freeze({ dx:  1, dy:  0 }),
    arrowup:    Object.freeze({ dx:  0, dy: -1 }),
    arrowdown:  Object.freeze({ dx:  0, dy:  1 }),
    arrowleft:  Object.freeze({ dx: -1, dy:  0 }),
    arrowright: Object.freeze({ dx:  1, dy:  0 })
});