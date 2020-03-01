//Klasse für Spieler mit Attribut für Socket
class Player {
    constructor(socket, player) {
        this.socket = socket;
        this.name = player.name;
        this.mail = player.mail;
        this.score = player.score;
    }
}

module.exports = Player;