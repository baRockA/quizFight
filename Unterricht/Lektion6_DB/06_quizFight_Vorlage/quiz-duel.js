const Duel = require('./duel');

//Klasse QuizDuel definieren, die von Duel erbt
class QuizDuel extends Duel {
    constructor(p1, p2) {
        //Konstruktor muss mit super() den Konstruktor der Super-Klasse aufrufen
        super(p1, p2, "quiz");
        this.gametype = "quiz";

        //Lektion 6 Aufgabe 3 c.) datacontroller (dc) verwenden, um Frage zu suchen


    }

    //makeTurn muss angepasst werden
    makeTurn(playerName, selection) {
        if (this.selections[playerName] === null) {
            if (selection === null) {
                this.sendToPlayer(playerName, JSON.stringify(this.question));
            } else {
                this.selections[playerName] = selection;
                this.msg.status = 1;
                this.sendToPlayer(playerName, 'Du hast ' + this.answers[selection] + ' gewählt.');
            }
        }
        return this.checkGameOver();
    }

    getGameResult() {
        if (this.selections[this.name1] === this.rightAnswer) {
            if (this.selections[this.name2] === this.rightAnswer) {
                //Unentschieden
                this.sendToPlayers("unentschieden. ");
                this.players[this.name1].score += 1;
                this.players[this.name2].score += 1;
            } else {
                // Spieler 1 Gewinnt
                this.sendToPlayer(this.name1, "gewonnen! ");
                this.sendToPlayer(this.name2, "verloren! ");
                this.players[this.name1].score += 3;
            }
        } else {
            if (this.selections[this.name2] === this.rightAnswer) {
                // Spieler 2 Gewinnt
                this.sendToPlayer(this.name2, "gewonnen! ");
                this.sendToPlayer(this.name1, "verloren! ");
                this.players[this.name2].score += 3;
            }
        }
    }
}

module.exports = QuizDuel;