import { Inimigo } from "./Inimigo";

export class Vorax extends Inimigo {
    constructor() {
        super("Vorax", 50, 12, 8, 25);
    }

    atacar(alvo) {
        console.log(`${this.nome} está tentando engolir ${alvo.nome}`);
    }

}