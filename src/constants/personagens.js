export const STATUS_JOGADOR = Object.freeze({
    nome: "Aventureiro",
    vida: 80,
    forca: 18,
    defesa: 10,
    velocidade: 1,
    nivel: 1
});

export const STATUS_INIMIGO = Object.freeze({
    VORAX: Object.freeze({
        nome: "Vorax",
        vida: 80,
        forca: 15,
        defesa: 8
    }),
    
    TRIGON: Object.freeze({
        nome: "Trigon",
        vida: 60,
        forca: 10,
        defesa: 7
    })
});