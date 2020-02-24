'use strict';

//Player-Objekte instanziieren und initialisieren
let player = { name: "", email: "", score: 0 };
let sock = io();
sock.on('msg', onMessage);

//Auf ein Logout-Event vom Server reagieren und die Funktion onLogout aufrufen.
sock.on('logout', onLogout);

//Empfangen der Highscore-Liste und Aufruf der Ausgabefunktion
sock.on('highscore', showHighscore);

//Definition der Event-Listener der Benutzerschnittstelle
document.getElementById('button-login').addEventListener('click', onLogin);

//Logout-Wrapper zu Beginn ausblenden
document.getElementById('logout-wrapper').hidden = true;

let form = document.getElementById('chat-form');
form.addEventListener('submit', sendMessage);

//Auf click des Logout-Buttons oder das schließen des Fensters reagieren
window.addEventListener('beforeunload', logoutPlayer);
document.getElementById('button-logout').addEventListener('click', logoutPlayer);

//Variable für den herausgeforderten Spieler im Modal-Menu
let challengedPlayer = "";

//EventListeners für Stein-Schere-Papier-Buttons
document.getElementById('rock').addEventListener('click', sendRPSTurn);
document.getElementById('paper').addEventListener('click', sendRPSTurn);
document.getElementById('scissors').addEventListener('click', sendRPSTurn);

//Login Funktion wird beim betätigen des Login Buttons ausgeführt
// schreiben von Werten in Attribute und manipulieren des DOM
function onLogin(event) {
    //Standard-Operation (abschicken des Formulars) unterdrücken
    event.preventDefault();

    let name_value = document.getElementById('input-name').value;
    let mail_value = document.getElementById('input-mail').value;
    //Zusatz: Name und Mail muss ausgefüllt sein, sonst kein Login
    if (mail_value && name_value) {
        //ausblenden des Login-Wrappers
        player.name = name_value;
        document.getElementById('player-name').innerText = player.name;
        document.getElementById('login-wrapper').hidden = true;
        document.getElementById('logout-wrapper').hidden = false;
        player.email = mail_value;

        //Senden des Playerobjekts als JSON an den Server
        sock.emit('login', JSON.stringify(player));
    } else {
        alert('Bitte E-Mail-Adresse und Name eingeben.');
    }
}

function onMessage(jsonmsg) {
    let msg = JSON.parse(jsonmsg);
    let list = document.getElementById('chat');
    let el = document.createElement('li');
    el.innerHTML = msg.from + ": " + msg.text;
    list.appendChild(el);
}

function sendMessage(ev) {
    var input = document.getElementById('chat-input');
    var value = input.value;

    //Input-Feld leeren
    input.value = '';

    //Message über socket zum Server schicken
    let msg = { from: player.name, text: value };
    sock.emit('msg', JSON.stringify(msg));

    //Reload der Seite durch Browser vermeiden
    ev.preventDefault();
}

//Spieler wieder zurücksetzen, Login-Felder wieder anzeigen und Meldung des Servers ausgeben.
function onLogout(msg) {
    player.name = "";
    player.email = "";
    player.score = 0;
    document.getElementById('login-wrapper').hidden = false;
    document.getElementById('logout-wrapper').hidden = true;
    alert(msg);
}

//Ausgabe der Highscore-Liste durch Listitems mit Spielername und Punktzahl
function showHighscore(data) {
    let highscore = JSON.parse(data);
    let list = document.getElementById('highscore');
    list.innerHTML = "";
    for (let i = 0; i < highscore.length; i++) {
        let el = document.createElement('li');
        el.innerHTML = highscore[i].name + ": " + highscore[i].score;

        //Ausgabe 2 a.) Erweiterung des Highscores zur Herausforderung eines Spielers bzw. zum annehmen einer Herausforderung.
        el.setAttribute("data-toggle", "modal");
        el.setAttribute("data-target", "#challengeMenu");
        el.setAttribute("id", highscore[i].name);
        el.addEventListener('click', onChallengePlayer);

        list.appendChild(el);
    }
}

//Logout durch den Client.
function logoutPlayer(event) {
    //"logout"-Event mit Player-Objekt als Inhalt an Server schicken
    sock.emit('logout', JSON.stringify(player));
    onLogout("Abgemeldet. Bis zum nächsten mal!");
}

//Anpassen der Überschrift im Modal und Auswahl des herausgeforderten Spielers mit Anzeige auf der Seite
function onChallengePlayer(event) {
    challengedPlayer = event.target.id;
    document.getElementById('challengedPlayerName').innerText = challengedPlayer;
}

//Funktion um einen Zug an den Server zu schicken
function sendRPSTurn(event) {
    if (challengedPlayer && challengedPlayer !== player.name) {
        let myturn = { player1: player.name, player2: challengedPlayer, turn: event.target.id, game: "rps" };
        sock.emit('challenge', JSON.stringify(myturn));
    }
    //Lektion 4 Zusatzaufgabe: Ausblenden des modalen Dialogs von Bootstrap nach Auswahl

}