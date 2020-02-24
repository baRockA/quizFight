class RPSDuel {

    constructor(p1, p2) {
        this.gametype = "rps";
        this.players = new Array();
        this.players[p1.player.name] = p1;
        this.players[p2.player.name] = p2;
        this.name1 = p1.player.name;
        this.name2 = p2.player.name;
        this.selections = new Array();
        this.selections[this.name1] = null;
        this.selections[this.name2] = null;
        this.sendToPlayer(this.name1, "Stein-Schere-Papier gegen " + this.name2 + " startet!");
        this.sendToPlayer(this.name2, "Du wurdest zu Stein-Schere-Papier gegen " + this.name1 + " herausgefordert!");

    }

    //Senden von Nachrichten an einen der Spieler, der durch seinen Namen ausgewählt wird
    sendToPlayer(playerName, data) {
        this.players[playerName].socket.emit('msg', JSON.stringify({ from: 'Server', text: data }));
    }

    //Senden von Nachrichten an alle Spieler
    sendToPlayers(data) {
        //For...in-Schleife zum durchlaufen aller Objekte in einem Array ohne Zähler
        for (let p in this.players) {
            this.sendToPlayer(this.players[p].player.name, data);
        }
    }

    //Durchführen eines Zuges für den Spieler, der durch die Zahl playerIndex gegeben ist
    makeTurn(playerName, selection) {
        //Zusatzaufgabe c.) Spieler darf nur einmal ziehen. Code wird nur ausgeführt wenn "selections" für diesen Spieler noch keinen Wert enthält.
        if (!this.selections[playerName]) {
            this.selections[playerName] = selection;
            this.sendToPlayer(playerName, 'Du hast ' + selection + ' gewählt.');
        }
        this.checkGameOver();
    }

    //Abschluss des Spiels prüfen
    checkGameOver() {
        if (this.selections[this.name1] && this.selections[this.name2]) {
            this.sendToPlayers("Game Over! " + this.name1 + ":" + this.selections[this.name1] + " vs " + this.name2 + ":" + this.selections[this.name2]);
        }
    }
}

module.exports = RPSDuel;