//ChallengeMsg Klasse einbinden
const ChallengeMsg = require('./challengemsg');

class Duel {
    constructor(p1, p2, gametype) {
        this.players = new Array();
        this.players[p1.name] = p1;
        this.players[p2.name] = p2;
        this.name1 = p1.name;
        this.name2 = p2.name;
        this.selections = new Array();
        this.selections[this.name1] = null;
        this.selections[this.name2] = null;
        //Instanz der Klasse ChallengeMsg in einem Attribut speichern und zum senden verwenden
        this.msg = new ChallengeMsg(0, this.name1, this.name2, gametype, "");
    }

    //Senden von Nachrichten an einen der Spieler, der durch seinen Namen ausgewählt wird
    sendToPlayer(playerName, data) {
        //Instanz der Klasse ChallengeMsg anpassen und senden
        this.msg.text = data;
        this.players[playerName].socket.emit('challenge', JSON.stringify(this.msg));
    }

    //Senden von Nachrichten an alle Spieler
    sendToPlayers(data) {
        //For...in-Schleife zum durchlaufen aller Objekte in einem Array ohne Zähler
        for (let p in this.players) {
            this.sendToPlayer(this.players[p].name, data);
        }
    }

    makeTurn(playerName, selection) {}

    //Abschluss des Spiels prüfen
    checkGameOver() {
        if (this.selections[this.name1] !== null &&
            this.selections[this.name2] !== null) {
            //Auswertung wird als Status der Nachricht gesetzt und als Funktion aufgerufen
            this.msg.status = 2;
            this.sendToPlayers("Game Over!");
            this.getGameResult();
            return false;
        }
        return true;
    }

    getGameResult() {}
}

module.exports = Duel;