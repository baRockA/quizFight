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

//Zusatzaufgabe Lektion 3

let form = document.getElementById('chat-form');
form.addEventListener('submit', sendMessage);

//Hausaufgabe Lektion 3: c.) Auf click des Logout-Buttons oder das schließen des Fensters reagieren

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

        //Zusatzaufgabe Lektion 3
        document.getElementById('logout-wrapper').hidden = false;

        player.email = mail_value;

        //Senden des Playerobjekts als JSON an den Server
        sock.emit('login', JSON.stringify(player));
    } else {
        alert('Bitte E-Mail-Adresse und Name eingeben.');
    }
}

// Zusatzaufgabe Lektion 3 a.) Chat mit JSON Objekten
function onMessage(msg) {
    let list = document.getElementById('chat');
    let el = document.createElement('li');
    el.innerHTML = msg;
    list.appendChild(el);
}

function sendMessage(ev) {
    var input = document.getElementById('chat-input');
    var value = input.value;
    //Input-Feld leeren
    input.value = '';

    // Zusatzaufgabe Lektion 3 a.) Chat mit JSON Objekten
    //Message über socket zum Server schicken
    sock.emit('msg', value);

    //Reload der Seite durch Browser vermeiden
    ev.preventDefault();
}

//Spieler wieder zurücksetzen, Login-Felder wieder anzeigen und Meldung des Servers ausgeben.
function onLogout(msg) {
    player.name = "";
    player.email = "";
    player.score = 0;
    document.getElementById('login-wrapper').hidden = false;

    //Hausaufgabe Lektion 3

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
        list.appendChild(el);
    }
}

//Hausaufgabe Lektion 3: b.)
//Logout durch den Client.