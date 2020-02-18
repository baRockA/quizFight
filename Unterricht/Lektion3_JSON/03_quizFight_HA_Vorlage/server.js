'use strict';

// Einbinden der benötigten Bibliotheken
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

let app = express();
let server = http.createServer(app);
let io = socketio(server);

//Array  in dem alle Spieler abgelegt sind
let lobby = [];

//Auf Verbindungen von Clients reagieren
io.on('connection', connected);

//Client-App an anfragenden Client ausliefern
app.use(express.static(__dirname + '/quizFight-client'));
server.listen(8080, showReady);

function showReady() {
    console.log('Server connected!');
}

function connected(sock) {
    // Zusatzaufgabe Lektion 3 a.) Chat mit JSON Objekten
    //Start-Message "msg" zum verbundenen Client schicken.
    sock.emit('msg', JSON.stringify({ from: 'Server', text: 'Verbindung zum Server aufgebaut, Bitte anmelden.' }));

    //Hausaufgabe Lektion 3: d.)
    //Event-Listener der Messages an alle Clients weiter gibt
    sock.on('msg', (txt) => io.emit('msg', txt));

    //Event-Handler für sock definieren, der auf das Event "login" reagiert und die Funktion onLogin aufruft
    sock.on('login', (data) => onLogin(sock, data));

    //Hausaufgabe Lektion 3: c.)
    //Event-Handler für sock, der auf einen "logout" durch den Client reagiert

}

//Fehlerbehandlung
server.on('error', serverError);

function serverError(err) {
    console.error('Server error: ', err);
}

//onLogin Funktion implementieren nach einfacher Beschreibung mit Hilfe-Karte
function onLogin(sock, data) {
    let p = JSON.parse(data);
    for (let i = 0; i < lobby.length; i++) {
        if (lobby[i].player.name === p.name) {
            sock.emit('logout', 'Name bereits vorhanden. Bitte erneut einloggen!');
            return 0;
        }
    }

    lobby.push({ socket: sock, player: p });
    //Nach jedem Login wird der Highscore neu versendet
    broadcastHighscore();
}

//Hausaufgabe von Lektion 3: c.)
//Bei einem Logout, Spieler aus der Lobby entfernen


//Versenden der Highscore-Liste als JSON-Objekt nach Sortierung
function broadcastHighscore() {
    let highscore = [];
    for (let i = 0; i < lobby.length; i++) {
        highscore.push({ name: lobby[i].player.name, score: lobby[i].player.score });
    }
    io.emit('highscore', JSON.stringify(highscore));
}

//Hausaufgabe Lektion 3 d.)