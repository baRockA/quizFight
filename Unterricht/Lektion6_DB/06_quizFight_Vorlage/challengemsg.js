class ChallengeMsg {
    constructor(status, p1, p2, game, text) {
        // Status 0 -> Herausgefordert und Spiel läuft noch nicht
        // Status 1 -> Zug gemacht
        // Status 2 -> Auswertung
        this.status = status;
        this.game = game;
        this.text = text;
        this.player1 = p1;
        this.player2 = p2;
    }
}

module.exports = ChallengeMsg;