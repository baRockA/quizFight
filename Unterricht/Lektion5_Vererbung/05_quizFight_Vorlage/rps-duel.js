//Lektion 4 Zusatzaufgabe:(3) ChallengeMsg Klasse einbinden
const ChallengeMsg = require('./challengemsg');

class RPSDuel {
    constructor(p1, p2) {
        this.players = new Array();
        this.gametype = "rps";
        //Zusatzaufgabe Lektion 4:(1) Änderungen wegen Player-Klasse
        this.players[p1.name] = p1;
        this.players[p2.name] = p2;
        this.name1 = p1.name;
        this.name2 = p2.name;
        this.selections = new Array();
        this.selections[this.name1] = null;
        this.selections[this.name2] = null;
        //Lektion 4 Zusatzaufgabe:(3) Instanz der Klasse ChallengeMsg in einem Attribut speichern und zum senden verwenden
        this.msg = new ChallengeMsg(0, this.name1, this.name2, this.gametype, "");
        this.sendToPlayer(this.name1, "Stein-Schere-Papier gegen " + this.name2 + " startet!");
        this.sendToPlayer(this.name2, "Du wurdest zu Stein-Schere-Papier gegen " + this.name1 + " herausgefordert!");

    }

    //Senden von Nachrichten an einen der Spieler, der durch seinen Namen ausgewählt wird
    sendToPlayer(playerName, data) {
        //Lektion 4 Zusatzaufgabe:(3) Instanz der Klasse ChallengeMsg senden
        this.msg.text = data;
        this.players[playerName].socket.emit('challenge', JSON.stringify(this.msg));
    }

    //Senden von Nachrichten an alle Spieler
    sendToPlayers(data) {
        //For...in-Schleife zum durchlaufen aller Objekte in einem Array ohne Zähler
        for (let p in this.players) {
            //Zusatzaufgabe Lektion 4:(1) Änderungen wegen Player-Klasse
            this.sendToPlayer(this.players[p].name, data);
        }
    }

    //Durchführen eines Zuges für den Spieler, der durch die Zahl playerIndex gegeben ist
    makeTurn(playerName, selection) {
        //Zusatzaufgabe Lektion 4:(1) Spieler darf nur einmal ziehen. Code wird nur ausgeführt wenn "selections" für diesen Spieler noch keinen Wert enthält.
        if (!this.selections[playerName]) {
            this.selections[playerName] = selection;
            //Zusatzaufgabe Lektion 4:(3) Status der ChallengeMsg anpassen und neue Nachricht schicken
            this.msg.status = 1;
            this.sendToPlayer(playerName, 'Du hast ' + selection + ' gewählt.');
        }
        this.checkGameOver();
    }

    //Abschluss des Spiels prüfen
    checkGameOver() {
        if (this.selections[this.name1] && this.selections[this.name2]) {
            //Zusatzaufgabe Lektion 4:(3) Auswertung wird als Status der Nachricht gesetzt und als Funktion aufgerufen
            this.msg.status = 2;
            this.sendToPlayers("Game Over! " + this.name1 + ":" + this.selections[this.name1] + " vs " + this.name2 + ":" + this.selections[this.name2]);
            this.getGameResult();

        }
    }

    //Zusatzaufgabe Lektion 4:(4) Resultat des Spiels berechnen und Punkte vergeben
    getGameResult() {
        let p1 = this.decodeTurn(this.selections[this.name1]);
        let p2 = this.decodeTurn(this.selections[this.name2]);

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

    //Zusatzaufgabe Lektion 4:(5) Übersetzen der Auswahl in eine ganze Zahl
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