const Duel = require('./duel');

//RPSDuel von Duel ableiten und alle Methoden und Attribute, 
//      die für jedes Duell gebraucht werden in Klassse Duel übernehmen.
class RPSDuel extends Duel {
    constructor(p1, p2) {
        //Konstruktor muss mit super() den Konstruktor der Super-Klasse aufrufen
        super(p1, p2, "rps");
        this.gametype = "rps";
        this.sendToPlayer(this.name1, "Stein-Schere-Papier gegen " + this.name2 + " startet!");
        this.sendToPlayer(this.name2, "Du wurdest zu Stein-Schere-Papier gegen " + this.name1 + " herausgefordert!");
    }

    //Durchführen eines Zuges für den Spieler, der durch die Zahl playerIndex gegeben ist
    makeTurn(playerName, selection) {
        //Spieler darf nur einmal ziehen. Code wird nur ausgeführt wenn "selections" für diesen Spieler noch keinen Wert enthält.
        if (!this.selections[playerName]) {
            this.selections[playerName] = selection;
            //Status der ChallengeMsg anpassen und neue Nachricht schicken
            this.msg.status = 1;
            this.sendToPlayer(playerName, 'Du hast ' + selection + ' gewählt.');
        }
        return this.checkGameOver();
    }

    //Resultat des Spiels berechnen und Punkte vergeben
    getGameResult() {
        let p1 = this.decodeTurn(this.selections[this.name1]);
        let p2 = this.decodeTurn(this.selections[this.name2]);

        //Berechnen der Gewinnentscheidung als Wert zwischen 0 und 2
        let wincondition = (p2 - p1 + 3) % 3;

        let result = "(" + this.name1 + ":" + this.selections[this.name1] + " vs " + this.name2 + ":" + this.selections[this.name2] + ")";
        switch (wincondition) {
            case 0: //Unentschieden
                this.sendToPlayers("unentschieden. " + result);
                this.players[this.name1].score += 1;
                this.players[this.name2].score += 1;
                break;
            case 1: //Spieler 1 gewinnt
                this.sendToPlayer(this.name1, "gewonnen! " + result);
                this.sendToPlayer(this.name2, "verloren! " + result);
                this.players[this.name1].score += 3;
                break;
            case 2: //Spieler 2 gewinnt
                this.sendToPlayer(this.name2, "gewonnen! " + result);
                this.sendToPlayer(this.name1, "verloren! " + result);
                this.players[this.name2].score += 3;
                break;
        }
    }

    //Übersetzen der Auswahl in eine ganze Zahl
    decodeTurn(turn) {
        switch (turn) {
            case "rock":
                return 0;
            case "scissors":
                return 1;
            case "paper":
                return 2;
            default:
                throw new Error('Auswahl konnte nicht deodiert werden!');
        }
    }
}

module.exports = RPSDuel;